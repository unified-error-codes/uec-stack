from typing import Optional
from .api_keys import APIKey, hash_api_key

_API_KEYS = {
    "local-dev": APIKey(
        key_id="local-dev",
        key_hash=hash_api_key("dev-secret-key"),
        scopes={"sessions:read", "errors:read"},
    )
}


def get_api_key(raw_key: str) -> Optional[APIKey]:
    for api_key in _API_KEYS.values():
        if api_key.active and api_key.matches(raw_key):
            return api_key
    return None
