from pydantic import BaseModel

class ConnectionData(BaseModel):
    connection_string: str

class SQLServerConnectionData(BaseModel):
    username: str
    password: str
    host: str
    port: int = 1433
    database: str