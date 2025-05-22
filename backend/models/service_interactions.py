from sqlalchemy import Column, Integer, String, Text, DateTime, func
from database import Base  # assuming you have a 'database.py' with Base = declarative_base()

class ServiceInteraction(Base):
    __tablename__ = "service_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    service_category = Column(String, nullable=True)
    business_phone_number = Column(String, nullable=True)
    request_type = Column(String, default='text')
    request_content = Column(Text, nullable=False)
    response_content = Column(Text, nullable=True)
    status = Column(String, default='pending')
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)
