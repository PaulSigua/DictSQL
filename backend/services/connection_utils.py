from urllib.parse import quote_plus
from services.detect_driver_sql_server import detect_odbc_driver_sqlserver

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
