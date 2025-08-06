from fastapi import APIRouter, HTTPException
from schemas.common import BaseConnectionInput, BatchConnectionInput 
from typing import Optional, List
from services.connection_store import store_connection_in_db, get_connection_from_db, update_connection_status, get_all_connections
from services.metadata_service import get_metadata_by_connection, generate_connection_string
from services.batch_connection import validate_connections
from tests.test_connection_sql import test_connection_and_schema

router = APIRouter(
    prefix="/connections",
    tags=["Conexiones"]
)

@router.post("/connect")
async def connect_database(data: BaseConnectionInput):
    try:
        conn_dict = data.dict()
        connection_string = generate_connection_string(conn_dict)
        conn_dict["connection_string"] = connection_string

        result = test_connection_and_schema(connection_string)

        if result["status"] == "success":
            connection_id = store_connection_in_db(conn_dict)
            result["id"] = connection_id

        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/metadata/{connection_id}")
async def metadata(connection_id: str):
    conn = get_connection_from_db(connection_id)
    if not conn:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")

    if not conn.get("is_active", True):
        raise HTTPException(status_code=403, detail="La conexión está desactivada")

    return get_metadata_by_connection(conn)

@router.post("/batch")
async def validate_batch(data: BatchConnectionInput):
    return validate_connections([conn.dict() for conn in data.connections])

@router.post("/disconnect/{connection_id}")
async def disconnect_connection(connection_id: str):
    updated = update_connection_status(connection_id, is_active=False)
    if not updated:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")
    return {"status": "disconnected", "id": connection_id}


@router.get("/all")
async def list_connections(status: Optional[str] = "active") -> List[dict]:
    return get_all_connections(status)
