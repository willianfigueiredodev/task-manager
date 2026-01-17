from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from config.database import get_db
from schemas import TaskCreate, TaskResponse, TaskUpdate
from services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create(task: TaskCreate, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.create_task(task)

@router.get("/", response_model=List[TaskResponse])
def list_all(completed: Optional[bool] = None, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.list_tasks(completed)

@router.get("/{task_id}", response_model=TaskResponse)
def get_one(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    task = service.get_task(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return task

@router.patch("/{task_id}", response_model=TaskResponse)
def update(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    service = TaskService(db)
    task = service.update_task(task_id, task_update)
    
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