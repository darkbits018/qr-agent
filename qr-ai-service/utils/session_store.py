# For now, use in-memory store
session_store = {}


def get_session_key(org_id, table_id):
    return f"{org_id}_{table_id}"


def get_or_create_session(org_id, table_id):
    key = get_session_key(org_id, table_id)
    if key not in session_store:
        session_store[key] = {"state": "start", "order": []}
    return session_store[key]


def update_session(key, data):
    session_store[key].update(data)
