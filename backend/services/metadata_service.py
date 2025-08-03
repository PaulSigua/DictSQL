from sqlalchemy import inspect
from database.connection import get_engine

def extract_metadata(connection_string: str):
    engine = get_engine(connection_string)
    inspector = inspect(engine)

    metadata = []

    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        pk = inspector.get_pk_constraint(table_name).get("constrained_columns", [])
        fks = inspector.get_foreign_keys(table_name)

        metadata.append({
            "table": table_name,
            "columns": [
                {
                    "name": col["name"],
                    "type": str(col["type"]),
                    "nullable": col["nullable"],
                    "primary_key": col["name"] in pk
                } for col in columns
            ],
            "foreign_keys": [
                {
                    "column": fk["constrained_columns"],
                    "references": fk["referred_table"]
                } for fk in fks
            ]
        })

    return metadata
