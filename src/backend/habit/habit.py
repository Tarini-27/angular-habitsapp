from fastapi import APIRouter, HTTPException, Depends
from models import Habit,HabitCompletion
from database import get_db, Base, engine
from sqlalchemy.orm import Session
from jwt_tokens import get_user_id
from schemas import HabitCreate,HabitResponse,HabitCompletionIn
from datetime import timedelta

habit_router = APIRouter()

Base.metadata.create_all(bind=engine)

@habit_router.get("/", response_model=list[HabitResponse])
def getHabits(db: Session = Depends(get_db), current_user: int = Depends(get_user_id)):
    try:
        return db.query(Habit).filter_by(userId=current_user).all()
    except:
        return("Failed to get user habits")

@habit_router.post("/", response_model=HabitResponse)
def create_habit(habit_data: HabitCreate, db: Session = Depends(get_db), current_user: int = Depends(get_user_id)):
    try:
        habit = Habit(userId = current_user, name = habit_data.name, frequency = habit_data.frequency)
        db.add(habit)
        db.commit()
        db.refresh(habit)
        return habit
    except:
        return("Failed to create habit")


@habit_router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db),current_user: int = Depends(get_user_id)):
    try:
        db.query(Habit).filter_by(userId=current_user, id=habit_id).delete()
        db.commit()
        return("Habit deleted successfully")
    except:
        return("Failed to delete habit")       

@habit_router.post("/{habit_id}/complete")
def mark_complete(habit_id: int, data:HabitCompletionIn, db: Session = Depends(get_db),current_user: int = Depends(get_user_id)):
        habit = db.query(Habit).filter_by(userId=current_user, id=habit_id).first()
        if habit is None:
             raise HTTPException(status_code=404, detail = "Habit not found")
        elif habit.frequency == "Daily":
            period_start = data.completion_date
        else: 
            period_start = data.completion_date - timedelta(days=data.completion_date.weekday())
        existing = db.query(HabitCompletion).filter_by(userId=current_user,habitId=habit_id,period_start=period_start).first()
        print("Existing:", existing)
        if existing:
            raise HTTPException(
                status_code = 400,
                detail = "Already completed"
            )
        else:
            habit_completion = HabitCompletion(userId=current_user, habitId=habit_id, period_start = period_start)
            db.add(habit_completion)
            db.commit()
            db.refresh(habit_completion)
            return("Habit completed successfully")



