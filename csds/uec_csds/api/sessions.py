from fastapi import APIRouter, Query, Request, Depends
from .schemas import FaultedSessionsResponse
from uec_csds.db.database import Database
from uec_csds.auth.middleware import require_scopes

router = APIRouter()

@router.get("/sessions", dependencies=[Depends(require_scopes({"sessions:read"}))])
async def list_sessions():
    return {"sessions": []}

def get_database(request: Request) -> Database:
    return request.app.state.db


@router.get("/sessions", response_model=FaultedSessionsResponse)
def list_faulted_sessions(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Database = Depends(get_database),
):
    [sessions, total] = db.get_faulted_sessions(limit=limit, offset=offset)
    return {"total": total, "items": sessions}
