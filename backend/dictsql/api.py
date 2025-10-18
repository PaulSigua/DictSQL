from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.connection_sql import router as connection_router
from routes.auth import router as auth_router
from database.sql import init_db

# App instance
app = FastAPI(
    title="DictSQL API",
    description="A simple API for managing SQL dictionaries",
    version="1.0.0"
)

origins = [
    "http://localhost:4200", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Permite cookies, cabeceras de autorización, etc.
    allow_methods=["*"],    # Permite todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],    # Permite todas las cabeceras (incluida 'Authorization')
)

app_prefix = "/api/v1"

# Record routes
app.include_router(auth_router, prefix=app_prefix)
app.include_router(connection_router, prefix=app_prefix)

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