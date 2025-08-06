from typing import List
from pydantic import BaseModel


class PostgreSQLConnectionData(BaseModel):
    connection_string: str


class PostgreSQLBatchInput(BaseModel):
    connections: List[PostgreSQLConnectionData]
