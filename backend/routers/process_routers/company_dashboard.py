from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status, Query, Body
from fastapi.responses import JSONResponse
from models.user import User
from models.company_document import CompanyDocument
from models.service_interactions import ServiceInteraction
from services.auth_services.auth_services import get_current_user
from services.process_services.document_service import extract_text_from_pdf, upsert_documents
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import shutil
import logging
import os
from database import get_db
from typing import Optional
from datetime import datetime
import smtplib
from email.message import EmailMessage

router = APIRouter(prefix="/api/company-dashboard", tags=["Company Content"])
logger = logging.getLogger(__name__)

@router.post("/register-service", summary="Upload and register a new company service document")
async def upload_company_doc(
    service_category: str = Form(...),
    contact_email: str = Form(...),
    contact_phone: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Ensure requester is a company
        if current_user.role != "company":
            raise HTTPException(status_code=403, detail="Only companies can upload documents")

        # File path setup
        safe_phone_number = current_user.business_phone_number.strip().replace("+", "").upper()
        company_dir = Path(f"public/companies/{safe_phone_number}")
        company_dir.mkdir(parents=True, exist_ok=True)
        file_path = company_dir / file.filename

        # Overwrite existing file
        if file_path.exists():
            try:
                file_path.unlink()
            except Exception as e:
                logger.exception("Failed to remove existing file")
                raise HTTPException(status_code=500, detail="Failed to overwrite existing document file.")

        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            logger.exception("File saving failed")
            raise HTTPException(status_code=500, detail="Failed to save uploaded file.")

        # Create DB record
        company_doc = CompanyDocument(
            service_category=service_category,
            pdf_filename=str(file_path),
            contact_email=contact_email,
            contact_phone=contact_phone,
            business_phone_number=safe_phone_number,
        )

        db.add(company_doc)
        await db.commit()
        await db.refresh(company_doc)

        # Extract and upsert into vector DB
        try:
            extracted_texts = extract_text_from_pdf(str(file_path))
            vector_data = [{"id": f"{company_doc.id}-{i}", "text": text} for i, text in enumerate(extracted_texts)]
            namespace = service_category.strip().replace(" ", "_").upper()
            upsert_documents(
                data=vector_data,
                index_name=safe_phone_number,
                namespace=namespace
            )
        except Exception as e:
            logger.exception("Semantic indexing failed")
            raise HTTPException(status_code=500, detail=f"Failed to process document for semantic search: {str(e)}")

        return {
            "message": "File uploaded, saved, and processed successfully",
            "document_id": company_doc.id
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during document upload")
        raise HTTPException(status_code=500, detail="Unexpected server error during document upload")


# --------------------------------------------------------------------------

@router.get("/my-services", summary="Get all services for the logged-in company")
async def get_company_services(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        if current_user.role != "company":
            raise HTTPException(status_code=403, detail="Only companies can access their documents")

        stmt = select(CompanyDocument).where(
            CompanyDocument.business_phone_number == current_user.business_phone_number.strip().replace("+", "").upper()
        )
        result = await db.execute(stmt)
        company_documents = result.scalars().all()

        if not company_documents:
            raise HTTPException(status_code=404, detail="No services found for this company")

        return [
            {
                "id": doc.id,
                "service_category": doc.service_category,
                "pdf_filename": doc.pdf_filename,
                "created_at": str(doc.created_at) if hasattr(doc, "created_at") else None
            }
            for doc in company_documents
        ]

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to retrieve company services")
        raise HTTPException(status_code=500, detail="Failed to retrieve company services")

# ---------------------------------------------------------------------------------

@router.get("/logs", summary="Get company service interactions between start and end date")
async def get_company_interactions(
    start_date: Optional[datetime] = Query(None, description="Filter by created_at >= start_date"),
    end_date: Optional[datetime] = Query(None, description="Filter by created_at <= end_date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Only companies can access this endpoint.")

    stmt = select(ServiceInteraction).where(
        ServiceInteraction.business_phone_number == current_user.business_phone_number.strip().replace("+", "").upper()
    )

    if start_date:
        stmt = stmt.where(ServiceInteraction.created_at >= start_date)
    if end_date:
        stmt = stmt.where(ServiceInteraction.created_at <= end_date)

    result = await db.execute(stmt)
    interactions = result.scalars().all()

    return {"interactions": [interaction.__dict__ for interaction in interactions]}

@router.get("/pending-logs", summary="Get company service interactions between start and end date")
async def get_pending_company_interactions(
    start_date: Optional[datetime] = Query(None, description="Filter by created_at >= start_date"),
    end_date: Optional[datetime] = Query(None, description="Filter by created_at <= end_date"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Only companies can access this endpoint.")

    stmt = select(ServiceInteraction).where(
        ServiceInteraction.business_phone_number == current_user.business_phone_number.strip().replace("+", "").upper(), 
        ServiceInteraction.status == 'pending'
    )

    if start_date:
        stmt = stmt.where(ServiceInteraction.created_at >= start_date)
    if end_date:
        stmt = stmt.where(ServiceInteraction.created_at <= end_date)

    result = await db.execute(stmt)
    interactions = result.scalars().all()

    return {"interactions": [interaction.__dict__ for interaction in interactions]}


@router.patch("/update-response/{interaction_id}", summary="Company inserts response and broadcasts update")
async def update_interaction_response(
    interaction_id: int,
    response_data: dict = Body(..., example={"response_content": "Your request has been processed."}),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Only companies can respond.")

    stmt = select(ServiceInteraction).where(ServiceInteraction.id == interaction_id)
    result = await db.execute(stmt)
    interaction = result.scalar_one_or_none()

    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found.")

    response_text = response_data.get("response_content", "").strip()
    if not response_text:
        raise HTTPException(status_code=400, detail="Response content cannot be empty.")

    interaction.response_content = response_text
    interaction.status = "completed"
    interaction.completed_at = datetime.utcnow()

    try:
        await db.commit()
        logger.info(f"Interaction #{interaction.id} marked as completed by company: {current_user.email}")

        # Send notification email
        try:
            msg = EmailMessage()
            msg['Subject'] = f"Your Request #{interaction.id} Has Been Answered"
            msg['From'] = 'illia.jwai888@gmail.com'
            msg['To'] = interaction.user_email  # Ensure this field is correct
            msg.set_content(
                f"Dear User,\n\n"
                f"Your service request has been processed.\n\n"
                f"🔹 **Your Request:**\n{interaction.request_content}\n\n"
                f"🔹 **Our Response:**\n{response_text}\n\n"
                f"Best regards,\nSolveIT Support Team"
            )
            app_password = 'ioutfcfeobpsuyfp'  # Move to environment variable in production

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login('illia.jwai888@gmail.com', app_password)
                smtp.send_message(msg)
                logger.info(f"Notification email sent to {interaction.user_email}")

        except smtplib.SMTPAuthenticationError:
            logger.error("Gmail authentication failed. Check app password.")
        except Exception as e:
            logger.error(f"Failed to send email notification: {e}", exc_info=True)

        return {"message": "Response submitted and user notified."}

    except Exception as e:
        logger.error(f"DB update failed for interaction #{interaction_id}: {e}", exc_info=True)
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update interaction.")
