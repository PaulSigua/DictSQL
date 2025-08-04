from fastapi import FastAPI
from routes.schema_routes import router as schema_router

# App instance
app = FastAPI(
    title="DictSQL API",
    description="A simple API for managing SQL dictionaries",
    version="1.0.0"
)

app_prefix = "/api/v1"

# Record routes
app.include_router(schema_router, prefix=app_prefix, tags=["Schema"])


@app.get("/")
async def read_root():
    return {
        "API": "DictSQL",
        "status": "ok",
        "frontend": "http://localhost:4200",
        "docs": "http://localhost:9999/docs",
        "openapi": "http://localhost:9999/redoc"
    }
