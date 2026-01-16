from fastapi import FastAPI
from config.database import engine, Base
from routers import task_router
import models 

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(task_router.router)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "message": "Task Manager API rodando com Arquitetura Modular! 🚀"
    }