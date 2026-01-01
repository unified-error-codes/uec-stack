from csds.uec_csds.db.postgres import get_connection
from csds.uec_csds.db.models import SCHEMA_SQL


def init_db():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(SCHEMA_SQL)
        conn.commit()
