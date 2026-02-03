import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from uec_csds.db.database import Database
from uec_csds.db.models import Base
from uec_csds.api.api import create_app


@pytest.fixture(scope="session")
def db():
    engine = create_engine(
        "sqlite:///./test.db",
        connect_args={"check_same_thread": False},
    )

    # ⬅⬅⬅ KLUCZOWE
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    database = Database(db_url="sqlite:///./test.db")
    return database


@pytest.fixture(scope="session")
def client(db):
    app = create_app(db)
    return TestClient(app)
