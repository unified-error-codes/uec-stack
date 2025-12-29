import uuid


class Database:
    def __init__(self, data_dir):
        self.sessions = []

    def insert_session(
        self, charger_id: str, error_code: str, timestamp: str, telemetry: str
    ):
        self.sessions.append(
            {
                "charger_id": charger_id,
                "error_code": error_code,
                "timestamp": timestamp,
                "telemetry": telemetry,
            }
        )
