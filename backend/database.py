from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL

# Async SQLAlchemy engine (set echo=False in production)
engine = create_async_engine(DATABASE_URL, echo=True)

# Asynchronous session maker
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

# Declarative Base instance (this was missing)
Base = declarative_base()

# Dependency to get DB session
async def get_db():
    async with AsyncSessionLocal() as db:
        yield db
