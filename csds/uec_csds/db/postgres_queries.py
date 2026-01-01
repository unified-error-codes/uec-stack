from csds.uec_csds.db.postgres import get_connection


def get_faulted_sessions(limit: int, offset: int) -> list[dict]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                  session_id,
                  failure_timestamp AS timestamp,
                  charge_point_id,
                  connector_id,
                  error_code
                FROM sessions
                ORDER BY failure_timestamp DESC
                LIMIT %s OFFSET %s
                """,
                (limit, offset),
            )
            return cur.fetchall()


def count_faulted_sessions() -> int:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) AS total FROM sessions")
            row = cur.fetchone()
            if row:
                return row["total"]
            return 0
