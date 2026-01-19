import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager
from .models import Session, Base
import uuid


class Database:
    def __init__(self, db_url: str | None = None):
        self.db_url = db_url or os.getenv(
            "DATABASE_URL",
            "postgresql://localhost:5432/uec_csds",
        )
        self.engine = create_engine(self.db_url)
        self.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        # TODO(db-migrations): replace direct metadata.create_all usage with a proper
        # schema migration workflow (e.g., Alembic). This constructor currently
        # assumes responsibility for creating any missing tables but should, in the
        # future, rely on migrations run as part of deployment instead.

        # Base.metadata.drop_all(bind=engine,)
        Base.metadata.create_all(
            bind=self.engine,
        )

    def get_faulted_sessions(
        self, limit: int, offset: int
    ) -> tuple[list[Session], int]:
        with self._get_db() as db:
            query = db.query(Session).order_by(Session.stop_timestamp.desc())
            total_count = query.count()
            sessions = query.offset(offset).limit(limit).all()
            return sessions, total_count

    def insert_session(
        self,
        charge_point_id: str,
        connector_id: int,
        error_code: str,
        timestamp: str,
        telemetry: str,
    ):
        with self._get_db() as db:
            db_session = Session(
                session_id=str(uuid.uuid4()),
                charge_point_id=charge_point_id,
                connector_id=connector_id,
                error_code=error_code,
                start_timestamp=timestamp,
                stop_timestamp=timestamp,
                telemetry=telemetry.encode("utf-8"),
            )
            db.add(db_session)
            db.commit()
            db.refresh(db_session)
            return db_session

    @contextmanager
    def _get_db(self):
        db = self.SessionLocal()
        try:
            yield db
        finally:
            db.close()
