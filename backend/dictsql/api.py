from fastapi import FastAPI
from routes.postgresql.postgresql_routes import router as postgresql
from routes.sqlserver.sqlserver_routes import router as sqlserver

# App instance
app = FastAPI(
    title="DictSQL API",
    description="A simple API for managing SQL dictionaries",
    version="1.0.0"
)

app_prefix = "/api/v1"

# Record routes
app.include_router(postgresql, prefix=app_prefix)
app.include_router(sqlserver, prefix=app_prefix)
app.include_router

@app.get("/")
async def read_root():
    return {
        "API": "DictSQL",
        "status": "ok",
        "frontend": "http://localhost:4200",
        "docs": "http://localhost:9999/docs",
        "openapi": "http://localhost:9999/redoc"
    }
