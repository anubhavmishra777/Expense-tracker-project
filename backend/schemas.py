from pydantic import BaseModel

# Request (user input)
class  ExpenseCreate(BaseModel):
    amount: float
    description: str
    date: str


# Response (API output)
class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    description: str
    date: str

    class Config:
        from_attributes = True