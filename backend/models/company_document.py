from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from database import Base  # assuming you have a 'database.py' with Base = declarative_base()

class CompanyDocument(Base):
    __tablename__ = "company_documents"

    id = Column(Integer, primary_key=True, index=True)
    service_category = Column(String, nullable=False)
    pdf_filename = Column(String, nullable=False)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    business_phone_number = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
