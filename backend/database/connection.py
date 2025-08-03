from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

def get_engine(connection_string: str) -> Engine:
    engine = create_engine(connection_string)
    return engine
