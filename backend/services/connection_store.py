from typing import Dict

# In Memory
_connection_store: Dict[str, Dict] = {}

def store_connection(connection_id: str, connection_data: Dict):
    _connection_store[connection_id] = connection_data

def get_connection(connection_id: str) -> Dict:
    return _connection_store.get(connection_id)
