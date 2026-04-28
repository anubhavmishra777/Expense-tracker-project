from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database
DATABASE_URL = "sqlite:///./expenses.db"

# Engine create
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Session create
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Base class
Base = declarative_base()