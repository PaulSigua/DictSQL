from fastapi import FastAPI
from routes.connection_sql import router as connection_router
from routes.auth import router as auth_router
from database.sql import init_db

# App instance
app = FastAPI(
    title="DictSQL API",
    description="A simple API for managing SQL dictionaries",
    version="1.0.0"
)

app_prefix = "/api/v1"

# Record routes
app.include_router(connection_router, prefix=app_prefix)
app.include_router(auth_router, prefix=app_prefix)

@app.get("/")
async def read_root():
    return {
        "API": "DictSQL",
        "status": "ok",
        "frontend": "http://localhost:4200",
        "docs": "http://localhost:9999/docs",
        "openapi": "http://localhost:9999/redoc"
    }

def main():
    init_db()