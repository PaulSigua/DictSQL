from pydantic import BaseModel
from typing import List

class SQLServerConnectionData(BaseModel):
    username: str
    password: str
    host: str
    port: int = 1433
    database: str

class SQLServerBatchInput(BaseModel):
    connections: List[SQLServerConnectionData]
