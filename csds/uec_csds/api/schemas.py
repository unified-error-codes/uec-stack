from pydantic import BaseModel, Field
from typing import List


class FaultedSession(BaseModel):
    session_id: str
    timestamp: str  # ISO8601 string (na teraz)
    charge_point_id: str
    connector_id: int
    error_code: str


class FaultedSessionsResponse(BaseModel):
    total: int = Field(ge=0)
    items: List[FaultedSession]
