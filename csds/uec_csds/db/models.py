from sqlalchemy import Column, Integer, LargeBinary, String, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True)
    start_timestamp = Column(DateTime(timezone=True), nullable=False)
    stop_timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    charge_point_id = Column(String, nullable=False)
    connector_id = Column(Integer, nullable=False)
    error_code = Column(String)
    telemetry = Column(LargeBinary)
