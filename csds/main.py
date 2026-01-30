import logging
import os

from uec_csds.api.api import create_app
from uec_csds.db.database import Database


def configure_logging():
    logging.basicConfig(
        format="%(name)s - %(levelname)s - %(message)s",
        level=logging.INFO,
    )

    env_config = os.getenv("LOGLEVEL", "")
    if env_config:
        if ":" not in env_config and "=" not in env_config:
            logging.getLogger().setLevel(env_config.strip().upper())
            return

        for config in env_config.split(":"):
            try:
                logger_name, level_name = config.split("=")
                logging.getLogger(logger_name.strip()).setLevel(
                    level_name.strip().upper()
                )
            except ValueError:
                pass


# --- INIT LOGGING ---
configure_logging()

# --- INIT DATABASE ---
db = Database()

# --- CREATE ASGI APP ---
app = create_app(db)
