from sqlalchemy import Column, Integer, String, ForeignKey, Date, UniqueConstraint
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Habit(Base):
    __tablename__ = "habits"
    __table_args__ = {'sqlite_autoincrement': True}
    id = Column(Integer,primary_key=True,index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    name = Column(String, unique=False, index=True)
    frequency = Column(String)

class HabitCompletion(Base):
    __tablename__ = "habit_completion"
    id = Column(Integer,primary_key=True,index=True)
    userId = Column(Integer, ForeignKey("users.id"))
    habitId = Column(Integer, ForeignKey("habits.id"))
    period_start = Column(Date)

     
    
#  Uncomment this after you have the habit and completion models defined. This says that the combination of userId, habitId, and period_start must be unique in a class which has the __table_args__ constraint.

# So that your HabiCompletion table  can't say that you have done PDT twice on 10th July.

    __table_args__ = (
        UniqueConstraint("userId", "habitId", "period_start", name="habit_completion"),)
