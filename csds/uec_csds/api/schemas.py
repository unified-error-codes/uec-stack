from datetime import datetime
from pydantic import BaseModel
from typing import List

class FaultedSession(BaseModel):
    session_id: str
    charge_point_id: str
    connector_id: int
    error_code: str | None
    start_timestamp: datetime
    stop_timestamp: datetime

    model_config = {
        "from_attributes": True
    }

class FaultedSessionsResponse(BaseModel):
    items: List[FaultedSession]
    total: int
