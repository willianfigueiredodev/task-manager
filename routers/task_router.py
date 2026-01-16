from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas import TaskCreate, TaskResponse
from services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create(task: TaskCreate, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.create_task(task)

@router.get("/", response_model=List[TaskResponse])
def list_all(db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.list_tasks()

@router.get("/{task_id}", response_model=TaskResponse)
def get_one(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    task = service.get_task(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    success = service.delete_task(task_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    return None 