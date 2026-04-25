from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil

app = FastAPI(title="devOS System Monitor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "devOS System Monitor API"}

@app.get("/cpu")
async def get_cpu_usage():
    cpu_percent = psutil.cpu_percent(interval=1)
    return {"cpu_percent": cpu_percent}

@app.get("/health")
async def health_check():
    cpu_percent = psutil.cpu_percent(interval=1)
    return {"status": "healthy", "cpu_percent": cpu_percent}

@app.get("/system-info")
async def get_system_info():
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    memory = psutil.virtual_memory()

    return {
        "cpu": {
            "percent": cpu_percent,
            "count": cpu_count
        },
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "percent": memory.percent
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)