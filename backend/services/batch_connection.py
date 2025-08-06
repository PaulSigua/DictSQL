from tests.test_connection_sql import test_connection_and_schema
from services.metadata_service import generate_connection_string

def validate_connections(connections: list[dict]) -> list[dict]:
    results = []
    for conn in connections:
        try:
            conn_string = generate_connection_string(conn)
            result = test_connection_and_schema(conn_string)
        except Exception as e:
            result = {"status": "error", "detail": str(e)}
        results.append(result)
    return results
