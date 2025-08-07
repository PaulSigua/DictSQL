from concurrent.futures import ProcessPoolExecutor
from typing import List
from services.metadata_service import generate_connection_string
from tests.test_connection_sql import test_connection_and_schema

def validate_single_connection(conn: dict) -> dict:
    try:
        conn_string = generate_connection_string(conn)
        result = test_connection_and_schema(conn_string)
    except Exception as e:
        result = {"status": "error", "detail": str(e)}
    return result

def validate_connections(connections: List[dict]) -> List[dict]:
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(validate_single_connection, connections))
    return results
