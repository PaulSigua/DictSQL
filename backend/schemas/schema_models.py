from pydantic import BaseModel

class ConnectionData(BaseModel):
    connection_string: str
