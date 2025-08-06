from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import create_engine
from sqlalchemy.engine.url import make_url
from concurrent.futures import ProcessPoolExecutor
from typing import List, Dict, Any
from urllib.parse import quote_plus
from services.detect_driver_sql_server import detect_odbc_driver_sqlserver


def get_metadata_by_connection(conn: Dict[str, Any]) -> Dict:
    try:
        print(conn)
        if conn["type"] == "postgresql":
            if "connection_string" not in conn:
                return {"status": "error", "detail": "Falta 'connection_string' para PostgreSQL"}
            return extract_full_metadata(conn["connection_string"])

        elif conn["type"] == "sqlserver":
            for field in ["username", "password", "host", "port", "database"]:
                if field not in conn:
                    return {"status": "error", "detail": f"Falta el campo '{field}' para SQL Server"}

            safe_password = quote_plus(conn["password"])
            driver = detect_odbc_driver_sqlserver()
            connection_string = (
                f"mssql+pyodbc://{conn['username']}:{safe_password}@{conn['host']}:{conn['port']}/{conn['database']}"
                f"?driver={driver}&TrustServerCertificate=yes"
            )
            return extract_full_metadata(connection_string)

        else:
            return {
                "status": "error",
                "detail": f"Tipo no soportado: {conn['type']}"
            }

    except Exception as e:
        return {"status": "error", "detail": str(e)}

def extract_metadata_batch(connections: List[Dict[str, Any]]) -> List[Dict]:
    with ProcessPoolExecutor() as executor:
        return list(executor.map(get_metadata_by_connection, connections))

def extract_full_metadata(connection_string: str):
    try:
        url = make_url(connection_string)
        dialect = url.get_backend_name()

        engine = create_engine(connection_string)
        inspector = inspect(engine)

        full_metadata = []

        for table_name in inspector.get_table_names():
            columns = inspector.get_columns(table_name)
            pk = inspector.get_pk_constraint(table_name).get("constrained_columns", [])
            fks = inspector.get_foreign_keys(table_name)

            full_metadata.append({
                "table": table_name,
                "columns": [
                    {
                        "name": col["name"],
                        "type": str(col["type"]),
                        "nullable": col["nullable"],
                        "primary_key": col["name"] in pk,
                        "default": col.get("default", None)
                    }
                    for col in columns
                ],
                "foreign_keys": [
                    {
                        "column": fk["constrained_columns"],
                        "references_table": fk["referred_table"],
                        "references_column": fk["referred_columns"]
                    }
                    for fk in fks
                ]
            })

        return {
            "status": "success",
            "dialect": dialect,
            "tables_count": len(full_metadata),
            "metadata": full_metadata
        }

    except SQLAlchemyError as e:
        return {
            "status": "error",
            "detail": str(e.__cause__ or e)
        }


def generate_connection_string(data: dict) -> str:
    if data["type"] == "postgresql":
        return f"postgresql://{data['username']}:{data['password']}@{data['host']}:{data['port']}/{data['database']}"

    elif data["type"] == "sqlserver":
        password = quote_plus(data["password"])
        driver = detect_odbc_driver_sqlserver()
        return (
            f"mssql+pyodbc://{data['username']}:{password}@{data['host']}:{data['port']}/{data['database']}"
            f"?driver={driver}&TrustServerCertificate=yes"
        )

    raise ValueError("Tipo de conexión no soportado")
