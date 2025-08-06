from fastapi import APIRouter, HTTPException
from schemas.postgresql_schemas import PostgreSQLBatchInput, PostgreSQLConnectionData
from tests.test_connection_sql import test_connection_and_schema
from services.metadata_service import get_metadata_by_connection
from services.connection_store import store_connection, get_connection
from services.batch_connection import validate_postgresql_connections
import uuid

router = APIRouter(
    prefix="/api/v1/postgresql",
    tags=["PostgreSQL"]
)

@router.post("/connect")
async def connect_postgresql(data: PostgreSQLConnectionData):
    try:
        result = test_connection_and_schema(data.connection_string)

        if result["status"] == "success":
            connection_id = str(uuid.uuid4())
            store_connection(connection_id, {
                "type": "postgresql",
                "connection_string": data.connection_string
            })
            result["id"] = connection_id

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/metadata/{connection_id}")
async def metadata_postgresql(connection_id: str):
    connection = get_connection(connection_id)

    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")

    if connection["type"] != "postgresql":
        raise HTTPException(status_code=400, detail="Tipo de conexión inválido")

    return get_metadata_by_connection(connection)


@router.post("/batch")
async def validate_postgresql_batch(data: PostgreSQLBatchInput):
    try:
        return validate_postgresql_connections([conn.dict() for conn in data.connections])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
