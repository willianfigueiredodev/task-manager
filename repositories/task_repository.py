from sqlalchemy.orm import Session
from models import TaskModel
from schemas import TaskCreate

class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, task: TaskCreate):
        db_task = TaskModel(
            title=task.title,
            description=task.description,
            completed=task.completed
        )
        self.db.add(db_task)   
        self.db.commit()          
        self.db.refresh(db_task) 
        return db_task

    def find_all(self):
        return self.db.query(TaskModel).all()

    def find_by_id(self, task_id: int):
        return self.db.query(TaskModel).filter(TaskModel.id == task_id).first()

    def delete(self, task_id: int):
        task = self.find_by_id(task_id) 
        if task:
            self.db.delete(task)
            self.db.commit()
            return True
        return False