from fastapi import Request, HTTPException, status
from typing import Set
from .store import get_api_key


def require_scopes(required: Set[str]):
    async def dependency(request: Request):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing API key",
            )

        raw_key = auth.removeprefix("Bearer ").strip()
        api_key = get_api_key(raw_key)

        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid API key",
            )

        if not required.issubset(api_key.scopes):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        request.state.api_key = api_key
        return api_key

    return dependency
