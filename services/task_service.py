from sqlalchemy.orm import Session
from repositories.task_repository import TaskRepository
from schemas import TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, db: Session):
        self.repository = TaskRepository(db)

    def create_task(self, task_data: TaskCreate):
        return self.repository.create(task_data)

    def list_tasks(self, completed: bool = None):
        return self.repository.find_all(completed)

    def get_task(self, task_id: int):
        return self.repository.find_by_id(task_id)

    def update_task(self, task_id: int, task_data: TaskUpdate):
        return self.repository.update(task_id, task_data)

    def delete_task(self, task_id: int):
        return self.repository.delete(task_id)