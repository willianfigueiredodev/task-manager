from sqlalchemy.orm import Session
from models import TaskModel
from schemas import TaskCreate, TaskUpdate

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

    def find_all(self, completed: bool = None):
        query = self.db.query(TaskModel)
        
        if completed is not None:
            query = query.filter(TaskModel.completed == completed)
            
        return query.all()

    def find_by_id(self, task_id: int):
        return self.db.query(TaskModel).filter(TaskModel.id == task_id).first()

    def update(self, task_id: int, task_data: TaskUpdate):
        db_task = self.find_by_id(task_id)
        
        if not db_task:
            return None
        
        update_data = task_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_task, key, value)

        self.db.add(db_task)
        self.db.commit()
        self.db.refresh(db_task)
        return db_task

    def delete(self, task_id: int):
        task = self.find_by_id(task_id)
        if task:
            self.db.delete(task)
            self.db.commit()
            return True
        return False