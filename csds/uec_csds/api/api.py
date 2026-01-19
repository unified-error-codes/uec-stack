from fastapi import APIRouter, FastAPI
from .sessions import router as sessions_router
from uec_csds.db.database import Database


def create_app(db: Database) -> FastAPI:
    app = FastAPI(title="Charging Station Diagnostic System API")
    api_router = APIRouter(prefix="/api/v1")
    api_router.include_router(sessions_router, tags=["sessions"])
    app.include_router(api_router)
    app.state.db = db
    return app
