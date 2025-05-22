# models/user.py (updated)
from sqlalchemy import Column, Integer, String, Enum
from database import Base
import enum

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    user_phone_number = Column(String, nullable=True)
    domain = Column(String, nullable=True)
    business_phone_number = Column(String, nullable=True)

