from sqlalchemy import inspect
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import create_engine
from sqlalchemy.engine.url import make_url

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
