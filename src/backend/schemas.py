from pydantic import BaseModel, ConfigDict
from datetime import date

# Schemas

class AuthRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict

# Schemas for habits and completions
class HabitResponse(BaseModel):
    id: int
    name: str
    frequency: str
    model_config = ConfigDict(from_attributes=True)


class HabitCreate(BaseModel):
    name: str
    frequency: str

class HabitCompletionIn(BaseModel):
    completion_date: date