from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.company_document import CompanyDocument
from models.user import User
from models.service_interactions import ServiceInteraction
from services.auth_services.auth_services import get_current_user
from services.process_services.user_request_service import perform_semantic_search, generate_llm_answer
from faster_whisper import WhisperModel
from typing import Optional
import os
import logging
from datetime import datetime
import json 
from sqlalchemy import select, func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from datetime import timezone, timedelta
router = APIRouter(prefix="/api/user-dashboard", tags=["Call Center AI"])
logger = logging.getLogger(__name__)

@router.post("/user-request", summary="Process a user request via audio or text")
async def process_user_request(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    company_name: str = Form(...),
    service_category: str = Form(...),
    audio: Optional[UploadFile] = File(None),
    request_text: Optional[str] = Form(None)
):
    try:
        if current_user.role != "user":
            raise HTTPException(status_code=403, detail="Only users can submit requests.")

        if not audio and not request_text:
            raise HTTPException(status_code=400, detail="Either audio or request_text must be provided.")

        request_time = datetime.utcnow()

        # Step 1: Retrieve company phone number
        try:
            company_query = select(User.business_phone_number).where(
                User.full_name == company_name,
                User.role == "company"
            )
            company_result = await db.execute(company_query)
            business_phone_number = company_result.scalar_one_or_none()

            if not business_phone_number:
                raise HTTPException(status_code=404, detail="Company not found.")

            safe_phone_number = business_phone_number.strip().replace("+", "").upper()
        except Exception:
            logger.exception("Error retrieving company info")
            raise HTTPException(status_code=500, detail="Failed to retrieve company info.")

        # Step 2: Validate service
        try:
            service_query = select(CompanyDocument).where(
                CompanyDocument.business_phone_number == safe_phone_number,
                CompanyDocument.service_category == service_category
            )
            service_result = await db.execute(service_query)
            service_doc = service_result.scalar_one_or_none()

            if not service_doc:
                raise HTTPException(status_code=404, detail="Requested service not found for this company.")
        except Exception:
            logger.exception("Error validating service category")
            raise HTTPException(status_code=500, detail="Service lookup failed.")

        formatted_service_category = service_category.strip().replace(" ", "_").upper()

        # Step 3: Transcribe audio or use text
        try:
            user_query, request_type = None, None
            if audio and audio.filename:
                audio_path = "temp_audio.webm"
                with open(audio_path, "wb") as f:
                    f.write(await audio.read())
                model = WhisperModel("tiny.en", device="cpu", compute_type="int8")
                segments, _ = model.transcribe(audio_path)
                user_query = " ".join([seg.text for seg in segments])
                request_type = "audio"
                os.remove(audio_path)
            elif request_text:
                user_query = request_text.strip()
                request_type = "text"

            if not user_query:
                raise HTTPException(status_code=400, detail="Query could not be interpreted.")
        except Exception:
            logger.exception("Failed to parse user input")
            raise HTTPException(status_code=500, detail="Failed to parse audio or text.")

        # Step 4: Semantic Search
        try:
            top_matches = await perform_semantic_search(
                query=user_query,
                namespace=formatted_service_category,
                index_name=safe_phone_number
            )
            if not top_matches:
                raise ValueError("No relevant documents found.")

            top_context = "\n\n".join([match.get("metadata", {}).get("text", "") for match in top_matches])
        except Exception:
            logger.exception("Semantic search failed")
            interaction_db = ServiceInteraction(
                user_email=current_user.email,
                service_category=service_category,
                business_phone_number=safe_phone_number,
                request_type=request_type,
                request_content=user_query,
                response_content=None,
                status="pending",
                created_at=request_time,
                completed_at=None
            )
            db.add(interaction_db)
            await db.commit()
            return {"message": "Your request was submitted. Awaiting specialist review."}

        # Step 5: LLM Generation
        try:
            llm_response_text, parsed_answer = await generate_llm_answer(
                formatted_service_category=formatted_service_category,
                user_query=user_query,
                document_context=top_context
            )
            response_time = datetime.utcnow()

            # Normalize LLM response
            if isinstance(llm_response_text, list) and len(llm_response_text) == 1:
                response_text = llm_response_text[0]
            elif isinstance(llm_response_text, str):
                response_text = llm_response_text
            else:
                response_text = str(llm_response_text)

            fallback_phrases = [
                "i couldn't find the answer",
                "i'm sorry",
                "no relevant information",
                "cannot find",
                "not available in the documents",
            ]

            if any(phrase in response_text.lower() for phrase in fallback_phrases):
                interaction_db = ServiceInteraction(
                    user_email=current_user.email,
                    service_category=service_category,
                    business_phone_number=safe_phone_number,
                    request_type=request_type,
                    request_content=user_query,
                    response_content=None,
                    status="pending",
                    created_at=request_time,
                    completed_at=None
                )
                db.add(interaction_db)
                await db.commit()
                return {"message": "Your request was submitted. Awaiting specialist review."}

            # Store as completed
            interaction_db = ServiceInteraction(
                user_email=current_user.email,
                service_category=service_category,
                business_phone_number=safe_phone_number,
                request_type=request_type,
                request_content=user_query,
                response_content=response_text,
                status="completed",
                created_at=request_time,
                completed_at=response_time
            )
            db.add(interaction_db)
            await db.commit()

            return {
                "answer": parsed_answer,
            }

        except Exception:
            logger.exception("LLM generation failed")
            interaction_db = ServiceInteraction(
                user_email=current_user.email,
                service_category=service_category,
                business_phone_number=safe_phone_number,
                request_type=request_type,
                request_content=user_query,
                response_content=None,
                status="pending",
                created_at=request_time,
                completed_at=None
            )
            db.add(interaction_db)
            await db.commit()
            return {"message": "Your request was submitted. Awaiting specialist review."}

    except HTTPException:
        raise
    except Exception:
        logger.exception("Unexpected server error")
        raise HTTPException(status_code=500, detail="Unexpected server error.")

# -------------------------------------------------------------------------

@router.get("/get-all-services", summary="Get all service topics grouped by company full name")
async def get_all_service_categories(
    db: AsyncSession = Depends(get_db)
):
    try:
        # Perform JOIN with normalized phone numbers using SQL functions
        stmt = select(
            User.full_name,
            CompanyDocument.service_category
        ).join(
            User,
            CompanyDocument.business_phone_number == func.upper(func.replace(User.business_phone_number, '+', ''))
        )

        result = await db.execute(stmt)
        records = result.all()

        if not records:
            raise HTTPException(status_code=404, detail="No service topics found.")

        # Group service categories by normalized company name
        company_services = {}
        for company_name, service_category in records:
            normalized_name = company_name.strip()
            company_services.setdefault(normalized_name, []).append(service_category)

        # Sort service categories alphabetically
        for service_list in company_services.values():
            service_list.sort()

        # Final structured response
        structured_response = [
            {"company_name": name, "service_categories": categories}
            for name, categories in company_services.items()
        ]

        return {"data": structured_response}

    except HTTPException:
        raise
    except Exception:
        logger.exception("Error fetching service topics")
        raise HTTPException(status_code=500, detail="Failed to load service topics.")
    
# ----------------------------------------------------------------------------------
@router.get("/logs", summary="Get user's service interactions between start and end dates")
async def get_user_interactions(
    start_date: Optional[datetime] = Query(None, description="Filter by created_at >= start_date"),
    end_date: Optional[datetime] = Query(None, description="Filter by created_at <= end_date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "user":
        raise HTTPException(status_code=403, detail="Only users can access this endpoint.")

    # Start with filter by email
    stmt = select(ServiceInteraction).where(ServiceInteraction.user_email == current_user.email)

    # Handle naive datetime ranges (ensure UTC-based filtering)
    if start_date:
        start_date = start_date.astimezone(timezone.utc).replace(tzinfo=None)
        stmt = stmt.where(ServiceInteraction.created_at >= start_date)

    if end_date:
        end_date = end_date.astimezone(timezone.utc).replace(tzinfo=None) + timedelta(days=1)
        stmt = stmt.where(ServiceInteraction.created_at < end_date)

    # Execute the query
    result = await db.execute(stmt)
    interactions = result.scalars().all()

    # Return serialized interactions
    return {
        "interactions": [
            {
                "service_category": interaction.service_category,
                "request_type": interaction.request_type,
                "request_content": interaction.request_content,
                "response_content": interaction.response_content,
                "status": interaction.status,
                "created_at": interaction.created_at,
                "completed_at": interaction.completed_at,
            }
            for interaction in interactions
        ]
    }
    
@router.get("/pending-logs", summary="Get user's service interactions between start and end dates")
async def get_user_pending_interactions(
    start_date: Optional[datetime] = Query(None, description="Filter by created_at >= start_date"),
    end_date: Optional[datetime] = Query(None, description="Filter by created_at <= end_date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "user":
        raise HTTPException(status_code=403, detail="Only users can access this endpoint.")

    # Start query filtered by email and pending status
    stmt = select(ServiceInteraction).where(
        ServiceInteraction.user_email == current_user.email,
        ServiceInteraction.status == 'pending'
    )

    # Apply date filtering in UTC
    if start_date:
        start_date = start_date.astimezone(timezone.utc).replace(tzinfo=None)
        stmt = stmt.where(ServiceInteraction.created_at >= start_date)

    if end_date:
        end_date = end_date.astimezone(timezone.utc).replace(tzinfo=None) + timedelta(days=1)
        stmt = stmt.where(ServiceInteraction.created_at < end_date)

    # Execute query
    result = await db.execute(stmt)
    interactions = result.scalars().all()

    return {
        "interactions": [
            {
                "service_category": interaction.service_category,
                "request_type": interaction.request_type,
                "request_content": interaction.request_content,
                "response_content": interaction.response_content,
                "status": interaction.status,
                "created_at": interaction.created_at,
                "completed_at": interaction.completed_at,
            }
            for interaction in interactions
        ]
    }