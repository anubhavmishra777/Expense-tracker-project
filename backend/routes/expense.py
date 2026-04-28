from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas
from services.categorizer import categorize

router = APIRouter()

# 🔗 Database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ➕ ADD EXPENSE
@router.post("/add-expense", response_model=schemas.ExpenseResponse)
def add_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    
    # AI categorization
    category = categorize(expense.description)

    new_expense = models.Expense(
        amount=expense.amount,
        category=category,
        description=expense.description,
        date=expense.date
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


# 📄 GET ALL EXPENSES
@router.get("/get-expenses", response_model=list[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).all()


# ❌ DELETE EXPENSE
@router.delete("/delete-expense/{id}")
def delete_expense(id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == id).first()

    if expense:
        db.delete(expense)
        db.commit()
        return {"message": "Deleted successfully"}

    return {"error": "Expense not found"}