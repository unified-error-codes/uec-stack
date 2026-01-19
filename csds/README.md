# CSDS – Charging Station Diagnostic System

CSDS (Charging Station Diagnostic System) is a backend component of the UEC Software Stack.

It is responsible for ingesting, storing and exposing charging session data that ended
in a faulted state. CSDS provides a REST API intended to be consumed by dashboards,
monitoring systems or higher-level diagnostic services.

CSDS is intentionally limited in scope:
- no analysis
- no correlation
- no AI or inference logic

---

## Responsibilities

- Accept faulted charging session data
- Persist diagnostic records
- Provide a read-only REST API for querying faulted sessions
- Expose infrastructure health endpoints

---

## Quick Start

### Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Run locally

```bash
python main.py
```

## HTTP API

The API will be available at:

```
http://127.0.0.1:8000
```

OpenAPI documentation:

```
http://127.0.0.1:8000/docs
```

---

### List faulted sessions

Returns charging sessions considered faulted, i.e. sessions that ended with an error.
Ordered by the stop timestamp (newest first).

```http
GET /api/v1/sessions?limit=50&offset=0
```

Response:
```json
{
  "total": 3,
  "items": [
    {
      "session_id": "sess-003",
      "start_timestamp": "2026-01-05T09:05:00Z",
      "stop_timestamp": "2026-01-05T09:10:00Z",
      "charge_point_id": "CP-001",
      "connector_id": 1,
      "error_code": "COMM_TIMEOUT"
    }
  ]
}
```

---
