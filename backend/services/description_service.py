from sqlalchemy.orm import Session
from database.sql import SessionLocal
from models.description_model import DescriptionModel
from typing import List
from uuid import UUID

def get_descriptions_by_connection(connection_id: str) -> List[dict]:
    db: Session = SessionLocal()
    query = db.query(DescriptionModel).filter(
        DescriptionModel.connection_id == UUID(connection_id)
    ).all()

    db.close()

    return [
        {
            "table_name": d.table_name,
            "column_name": d.column_name,
            "description": d.description
        }
        for d in query
    ]
