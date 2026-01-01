from fastapi import APIRouter, Query

from csds.uec_csds.api.schemas import FaultedSessionsResponse
from csds.uec_csds.db.postgres_queries import (
    get_faulted_sessions,
    count_faulted_sessions,
)

router = APIRouter(prefix="/api/v1", tags=["sessions"])


@router.get("/sessions", response_model=FaultedSessionsResponse)
def list_faulted_sessions(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    items = get_faulted_sessions(limit=limit, offset=offset)
    total = count_faulted_sessions()

    return {"total": total, "items": items}
