from .database import Database
from typing import Protocol
import logging


logger = logging.getLogger(__name__.upper())


class Session(Protocol):
    async def get_diagnostic(self) -> str: ...
    def charger_id(self) -> str: ...
    def timestamp(self) -> str: ...
    def error_code(self) -> str: ...


class Engine:
    def __init__(self, data_dir: str):
        self._db = Database(data_dir)

    async def handle_failed_session(self, session: Session):
        log = await session.get_diagnostic()
        logger.debug(
            'Diagnostic log retrieved from charger %s:\n"""\n%s\n"""',
            session.charger_id(),
            log,
        )
        self._db.insert_session(
            session.charger_id(),
            session.error_code(),
            session.timestamp(),
            log,
        )
