from tests.test_connection_sql import test_sqlserver_connection, test_connection_and_schema

def validate_postgresql_connections(connections: list[dict]) -> list[dict]:
    results = []
    for conn in connections:
        try:
            result = test_connection_and_schema(conn["connection_string"])
        except Exception as e:
            result = {
                "status": "error",
                "detail": str(e)
            }
        results.append(result)
    return results


def validate_sqlserver_connections(connections: list[dict]) -> list[dict]:
    results = []
    for conn in connections:
        try:
            result = test_sqlserver_connection(
                username=conn["username"],
                password=conn["password"],
                host=conn["host"],
                port=conn["port"],
                database=conn["database"]
            )
        except Exception as e:
            result = {
                "status": "error",
                "detail": str(e)
            }
        results.append(result)
    return results
