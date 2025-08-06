from fastapi import APIRouter, HTTPException
from schemas.sqlserver_schemas import SQLServerConnectionData, SQLServerBatchInput
from tests.test_connection_sql import test_sqlserver_connection
from services.metadata_service import get_metadata_by_connection
from services.connection_store import store_connection, get_connection
from services.batch_connection import validate_sqlserver_connections
import uuid

router = APIRouter(
    prefix="/sqlserver",
    tags=["SQL Server"]
)

@router.post("/connect")
async def connect_sqlserver(data: SQLServerConnectionData):
    try:
        result = test_sqlserver_connection(
            username=data.username,
            password=data.password,
            host=data.host,
            port=data.port,
            database=data.database
        )

        if result["status"] == "success":
            connection_id = str(uuid.uuid4())
            store_connection(connection_id, {
                "type": "sqlserver",
                "username": data.username,
                "password": data.password,
                "host": data.host,
                "port": data.port,
                "database": data.database
            })
            result["id"] = connection_id

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/metadata/{connection_id}")
async def metadata_sqlserver(connection_id: str):
    connection = get_connection(connection_id)

    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")

    if connection["type"] != "sqlserver":
        raise HTTPException(status_code=400, detail="Tipo de conexión inválido")

    return get_metadata_by_connection(connection)

@router.post("/batch")
async def validate_batch_sqlserver(data: SQLServerBatchInput):
    return validate_sqlserver_connections([conn.dict() for conn in data.connections])