import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://localhost:5432",
)

connection = None


def get_connection() -> psycopg2.extensions.connection:
    global connection
    if connection is None:
        connection = psycopg2.connect(
            DATABASE_URL,
            cursor_factory=RealDictCursor,
        )
    return connection
