def test_sessions_requires_auth(client):
    """
    GET /api/v1/sessions without Authorization header
    → must return 401
    """
    response = client.get("/api/v1/sessions")
    assert response.status_code == 401


def test_sessions_with_valid_token(client):
    """
    GET /api/v1/sessions with valid Bearer token
    → must return 200
    """
    headers = {
        "Authorization": "Bearer dev-secret-key"
    }
    response = client.get("/api/v1/sessions", headers=headers)
    assert response.status_code == 200
