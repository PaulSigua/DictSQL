from fastapi import APIRouter, HTTPException
from schemas.schema_models import ConnectionData
from services.metadata_service import extract_metadata

router = APIRouter()

@router.post("/connect")
async def connect_to_db(data: ConnectionData):
    try:
        metadata = extract_metadata(data.connection_string)
        return metadata
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
