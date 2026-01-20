from pydantic import BaseModel, Field
from typing import List, Optional


class FaultedSession(BaseModel):
    session_id: str = Field(description="Universally Unique identifier for the session")
    start_timestamp: str = Field(
        description="ISO8601 formatted start timestamp of a session"
    )
    stop_timestamp: str = Field(
        description="ISO8601 formatted stop timestamp of a session"
    )
    charge_point_id: str = Field(description="Identifier of the charge point")
    connector_id: int = Field(description="Identifier of the connector")
    error_code: Optional[str] = Field(
        None, description="Error code associated with the faulted session"
    )


class FaultedSessionsResponse(BaseModel):
    total: int = Field(ge=0)
    items: List[FaultedSession]
