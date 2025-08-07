from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class DescriptionCreate(BaseModel):
    connection_id: UUID
    table_name: str
    column_name: Optional[str] = None
    description: str

class DescriptionResponse(DescriptionCreate):
    id: UUID
