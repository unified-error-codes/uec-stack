import hashlib
from dataclasses import dataclass
from typing import Set


def hash_api_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


@dataclass
class APIKey:
    key_id: str
    key_hash: str
    scopes: Set[str]
    active: bool = True

    def matches(self, raw_key: str) -> bool:
        return self.key_hash == hash_api_key(raw_key)
