from fastapi import APIRouter, HTTPException, Depends
from schemas.common import BaseConnectionInput, BatchConnectionInput 
from typing import Optional, List
from services.connection_store import store_connection_in_db, get_connection_from_db, update_connection_status, get_all_connections
from services.metadata_service import generate_connection_string, get_enriched_metadata
from services.batch_connection import validate_connections
from tests.test_connection_sql import test_connection_and_schema
from security.deps import get_current_user
from models.user_model import User

router = APIRouter(
    prefix="/connections",
    tags=["Conexiones SQL (PostgreSQL, SQL Server, Oracle SQL, MySQL, etc)"]
)

@router.post("/connect")
async def connect_database(
    data: BaseConnectionInput,
    current_user: User = Depends(get_current_user)
):
    try:
        conn_dict = data.dict()

        if not all([conn_dict.get(k) for k in ["type", "host", "port", "database"]]):
            raise HTTPException(status_code=422, detail="Campos obligatorios faltantes")

        connection_string = generate_connection_string(conn_dict)
        conn_dict["connection_string"] = connection_string

        result = test_connection_and_schema(connection_string)
        if result["status"] != "success":
            raise HTTPException(status_code=400, detail=result["detail"])

        connection_id = store_connection_in_db(conn_dict)
        result["id"] = connection_id
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.get("/metadata/{connection_id}")
def get_metadata(
    connection_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        if not connection_id:
            raise HTTPException(status_code=422, detail="connection_id es requerido")
        
        metadata = get_enriched_metadata(connection_id)
        if metadata.get("status") != "success":
            raise HTTPException(status_code=400, detail=metadata.get("detail"))
        
        return metadata
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener metadata: {str(e)}")

@router.post("/batch")
async def validate_batch(
    data: BatchConnectionInput,
    current_user: User = Depends(get_current_user)
):
    try:
        if not data.connections:
            raise HTTPException(status_code=422, detail="Lista de conexiones vacía")

        return validate_connections([conn.dict() for conn in data.connections])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en validación por lotes: {str(e)}")


@router.post("/disconnect/{connection_id}")
async def disconnect_connection(
    connection_id: str,
    current_user: User = Depends(get_current_user)
):
    try:
        if not connection_id:
            raise HTTPException(status_code=422, detail="connection_id es requerido")

        updated = update_connection_status(connection_id, is_active=False)
        if not updated:
            raise HTTPException(status_code=404, detail="Conexión no encontrada o ya desconectada")
        return {"status": "disconnected", "id": connection_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al desconectar: {str(e)}")


@router.get("/all")
async def list_connections(
    status: Optional[str] = "active",
    current_user: User = Depends(get_current_user)
) -> List[dict]:
    try:
        if status not in {"active", "inactive", "all"}:
            raise HTTPException(status_code=422, detail="Parámetro 'status' inválido")
        return get_all_connections(status)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar conexiones: {str(e)}")