from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import create_engine
from sqlalchemy.engine.url import make_url
from services.detect_driver_sql_server import detect_odbc_driver_sqlserver
from urllib.parse import quote_plus

def test_connection_and_schema(connection_string: str):
    try:
        # Detect the motor
        url = make_url(connection_string)
        dialect = url.get_backend_name()

        # Create engine and connect
        engine = create_engine(connection_string)
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        return {
            "status": "success",
            "dialect": dialect,
            "tables_count": len(tables),
            "tables": tables
        }

    except SQLAlchemyError as e:
        return {
            "status": "error",
            "detail": str(e.__cause__ or e)
        }

def test_sqlserver_connection(username: str, password: str, host: str, port: int, database: str):
    try:
        safe_password = quote_plus(password)
        
        # detect driver
        odbc_driver = detect_odbc_driver_sqlserver()

        connection_string = (
            f"mssql+pyodbc://{username}:{safe_password}@{host}:{port}/{database}"
            f"?driver={odbc_driver}&TrustServerCertificate=yes"
        )

        engine = create_engine(connection_string)
        inspector = inspect(engine)
        tables = inspector.get_table_names()

        return {
            "status": "success",
            "dialect": "mssql",
            "odbc_driver_used": odbc_driver.replace("+", " "),
            "tables_count": len(tables),
            "tables": tables
        }

    except SQLAlchemyError as e:
        return {
            "status": "error",
            "detail": str(e.__cause__ or e)
        }
