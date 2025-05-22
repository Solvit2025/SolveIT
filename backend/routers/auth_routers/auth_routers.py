from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from services.auth_services.auth_services import create_access_token, hash_password, verify_password
from database import get_db
from models.user import User
from config import ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from pathlib import Path
import logging

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)

# Pydantic Models
class BaseRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserRegisterRequest(BaseRegisterRequest):
    user_phone_number: str

class CompanyRegisterRequest(BaseRegisterRequest):
    domain: str
    business_phone_number: str

# Register normal user
@router.post("/register/user")
async def register_user(data: UserRegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        existing_user = await db.execute(select(User).filter(User.email == data.email))
        if existing_user.scalars().first():
            raise HTTPException(status_code=400, detail="Email is already registered")

        new_user = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="user",
            user_phone_number=data.user_phone_number
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return {"message": "User registered successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error (user): {e}")
        raise HTTPException(status_code=500, detail="Internal server error during user registration")

# Register company user
@router.post("/register/company")
async def register_company(data: CompanyRegisterRequest, db: AsyncSession = Depends(get_db)):
    try:
        existing_company = await db.execute(select(User).filter(User.email == data.email))
        if existing_company.scalars().first():
            raise HTTPException(status_code=400, detail="Email is already registered")

        new_company = User(
            full_name=data.full_name,
            email=data.email,
            password_hash=hash_password(data.password),
            role="company",
            domain=data.domain,
            business_phone_number=data.business_phone_number
        )

        db.add(new_company)
        await db.commit()
        await db.refresh(new_company)
        return {"message": "Company registered successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error (company): {e}")
        raise HTTPException(status_code=500, detail="Internal server error during company registration")

# Login with detailed error reporting
@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Check for missing fields
        if not form_data.username or not form_data.password:
            raise HTTPException(status_code=422, detail="Email and password must be provided")

        # 2. Fetch user by email (form_data.username is email)
        result = await db.execute(select(User).filter(User.email == form_data.username))
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No user found with this email")

        # 3. Check password
        if not verify_password(form_data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

        # 4. Token creation
        token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id), "role": user.role},
            expires_delta=token_expires
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during login")
