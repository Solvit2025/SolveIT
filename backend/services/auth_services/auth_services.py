from datetime import datetime, timedelta
from typing import Optional

import logging
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, WebSocket, status
from fastapi.security import OAuth2PasswordBearer

from jose import JWTError, jwt  # Use only `python-jose` for consistency

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
from models.user import User
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for handling authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Logging Setup
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # Ensure user_id is string
    to_encode.update({"exp": expire, "sub": str(data["sub"])})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    try:
        logger.info(f"Decoding token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")
        if not user_id:
            logger.error("Invalid token payload: missing 'sub' field")
            raise HTTPException(status_code=401, detail="Invalid token")

        # Convert user_id to integer (since JWT stores it as a string)
        user_id = int(user_id)

        result = await db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()

        if user is None:
            logger.error(f"User with ID {user_id} not found")
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except jwt.ExpiredSignatureError:
        logger.error("Token has expired", exc_info=True)
        raise HTTPException(status_code=401, detail="Token has expired")

    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=401, detail="Could not validate credentials")

    except Exception as e:
        logger.error(
            f"Unexpected error in get_current_user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")
    

async def get_current_user_ws(
    websocket: WebSocket, db: AsyncSession = Depends(get_db)
) -> User:
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)  # Policy Violation
        logger.warning("Missing token in WebSocket connection")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token"
        )

    try:
        logger.info(f"Decoding WebSocket token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")
        if not user_id:
            logger.error("Invalid token payload: missing 'sub'")
            await websocket.close(code=1008)
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = int(user_id)

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()

        if user is None:
            logger.error(f"User with ID {user_id} not found (WebSocket)")
            await websocket.close(code=1008)
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except jwt.ExpiredSignatureError:
        logger.error("WebSocket token has expired", exc_info=True)
        await websocket.close(code=1008)
        raise HTTPException(status_code=401, detail="Token has expired")

    except JWTError as e:
        logger.error(f"Invalid WebSocket token: {str(e)}", exc_info=True)
        await websocket.close(code=1008)
        raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:
        logger.exception("Unexpected error in get_current_user_ws")
        await websocket.close(code=1011)  # Internal Error
        raise HTTPException(status_code=500, detail="Internal Server Error")
