from fastapi import APIRouter, Depends, HTTPException, status
from services.auth_services.auth_services import get_current_user
from models.user import User
import logging

router = APIRouter(prefix="/api/protected", tags=["Protected"])
logger = logging.getLogger(__name__)

@router.get("/me")
async def read_users_me(current_user: User = Depends(get_current_user)) -> dict:
    try:
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

        return {
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role,
            "user_phone_number": getattr(current_user, "user_phone_number", None),
            "domain": getattr(current_user, "domain", None),
            "business_phone_number": getattr(current_user, "business_phone_number", None)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[Protected /me] Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while retrieving user information")
