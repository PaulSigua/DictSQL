from typing import Dict, Optional
from sqlalchemy.orm import Session
from models.connection_model import ConnectionModel
from database.sql import SessionLocal
from typing import Optional, List
from services.connection_utils import generate_connection_string
import uuid


def store_connection_in_db(conn_dict: dict) -> str:
    db: Session = SessionLocal()
    
    # Generate connection_string if is PostgreSQL
    connection_string = None
    if conn_dict["type"] == "postgresql":
        connection_string = generate_connection_string(conn_dict)

    existing = db.query(ConnectionModel).filter_by(
        type=conn_dict["type"],
        username=conn_dict["username"],
        password=conn_dict["password"],
        host=conn_dict["host"],
        port=conn_dict["port"],
        database=conn_dict["database"],
    ).first()

    if existing:
        connection_id = existing.id
    else:
        connection_id = str(uuid.uuid4())
        new_connection = ConnectionModel(
            id=connection_id,
            type=conn_dict["type"],
            username=conn_dict["username"],
            password=conn_dict["password"],
            host=conn_dict["host"],
            port=conn_dict["port"],
            database=conn_dict["database"],
            connection_string=connection_string
        )
        db.add(new_connection)
        db.commit()

    db.close()
    return connection_id


def get_connection_from_db(connection_id: str) -> Optional[Dict]:
    db: Session = SessionLocal()
    conn = db.query(ConnectionModel).filter_by(id=connection_id).first()
    db.close()

    if conn:
        return {
            "id": conn.id,
            "type": conn.type,
            "username": conn.username,
            "password": conn.password,
            "host": conn.host,
            "port": conn.port,
            "database": conn.database,
            "connection_string": conn.connection_string,
            "is_active": conn.is_active
        }
    return None

def update_connection_status(connection_id: str, is_active: bool) -> bool:
    db: Session = SessionLocal()
    conn = db.query(ConnectionModel).filter(ConnectionModel.id == connection_id).first()
    if not conn:
        db.close()
        return False
    conn.is_active = is_active
    db.commit()
    db.close()
    return True

def get_all_connections(status: str = "active") -> List[dict]:
    db: Session = SessionLocal()
    query = db.query(ConnectionModel)

    if status == "active":
        query = query.filter(ConnectionModel.is_active == True)
    elif status == "inactive":
        query = query.filter(ConnectionModel.is_active == False)

    results = query.all()
    db.close()

    return [
        {
            "id": conn.id,
            "type": conn.type,
            "connection_string": conn.connection_string,
            "username": conn.username,
            "host": conn.host,
            "port": conn.port,
            "database": conn.database,
            "is_active": conn.is_active
        }
        for conn in results
    ]
