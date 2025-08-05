from fastapi import APIRouter, HTTPException
from schemas.schema_models import ConnectionData, SQLServerConnectionData
from services.metadata_service import test_connection_and_schema, test_sqlserver_connection

router = APIRouter()

@router.post("/connect")
async def test_connection(data: ConnectionData):
    try:
        return test_connection_and_schema(data.connection_string)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/connect/sqlserver")
async def test_sqlserver(data: SQLServerConnectionData):
    try:
        return test_sqlserver_connection(
            username=data.username,
            password=data.password,
            host=data.host,
            port=data.port,
            database=data.database
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
