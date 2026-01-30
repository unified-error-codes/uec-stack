from datetime import datetime, UTC


def insert_faulted_session(db):
    session = db.insert_session(
        charge_point_id="CP-TEST-001",
        connector_id=1,
        error_code="GroundFailure",
        timestamp=datetime.now(UTC),  # ← TU JEST KLUCZ
        telemetry="{}",
    )
    return session.session_id



def test_faulted_session_is_returned(client, db):
    # given: a faulted session exists in DB
    session_id = insert_faulted_session(db)

    # when: querying sessions endpoint
    headers = {
        "Authorization": "Bearer dev-secret-key"
    }
    response = client.get("/api/v1/sessions", headers=headers)

    # then
    assert response.status_code == 200
    payload = response.json()

    assert "items" in payload
    assert payload["total"] >= 1

    ids = [s["session_id"] for s in payload["items"]]
    assert session_id in ids

    faulted = next(s for s in payload["items"] if s["session_id"] == session_id)
    assert faulted["error_code"] == "GroundFailure"
