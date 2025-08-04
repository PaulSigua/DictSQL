from fastapi import APIRouter, HTTPException
from schemas.schema_models import ConnectionData
from services.metadata_service import test_connection_and_schema

router = APIRouter()

@router.post("/connect")
async def test_connection(data: ConnectionData):
    try:
        return test_connection_and_schema(data.connection_string)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
