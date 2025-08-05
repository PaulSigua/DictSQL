import subprocess

def detect_odbc_driver_sqlserver() -> str:
    """
    Automatically detects the best ODBC driver for SQL Server available.
    Returns the formatted name to use in the URL.
    """
    try:
        output = subprocess.check_output(["odbcinst", "-q", "-d"]).decode()
        drivers = [line.strip("[]\r\n") for line in output.splitlines()]

        # Preferred order (from most recent to most common)
        preferred = [
            "ODBC Driver 18 for SQL Server",
            "ODBC Driver 17 for SQL Server",
            "ODBC Driver 11 for SQL Server"
        ]

        for driver in preferred:
            if driver in drivers:
                return driver.replace(" ", "+")

        # If none of your favorites are available, use the first one.
        if drivers:
            return drivers[0].replace(" ", "+")

    except Exception:
        pass

    # Fallback default
    return "ODBC+Driver+17+for+SQL+Server"