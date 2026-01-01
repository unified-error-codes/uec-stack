SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  failure_timestamp TIMESTAMPTZ NOT NULL,
  charge_point_id TEXT NOT NULL,
  connector_id INTEGER NOT NULL,
  error_code TEXT,
  status TEXT NOT NULL
);
"""
