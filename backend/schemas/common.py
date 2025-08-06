from pydantic import BaseModel
from typing import Optional, Literal, List

class BaseConnectionInput(BaseModel):
    type: Literal["postgresql", "sqlserver"]
    username: Optional[str] = None
    password: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database: Optional[str] = None

class BatchConnectionInput(BaseModel):
    connections: List[BaseConnectionInput]
