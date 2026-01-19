import argparse
import logging
import os
import asyncio
from uec_csds.csds import run


def configure_logging():
    logging.basicConfig(
        format="%(name)s - %(levelname)s - %(message)s", level=logging.INFO
    )
    env_config = os.getenv("LOGLEVEL", "")
    if env_config:
        if ":" not in env_config and "=" not in env_config:
            logging.getLogger().setLevel(env_config.strip().upper())
            print(f"--> Custom logging: Set root logger to {env_config.upper()}")
            return
        for config in env_config.split(":"):
            try:
                logger_name, level_name = config.split("=")
                logging.getLogger(logger_name.strip().upper()).setLevel(
                    level_name.strip().upper()
                )
                print(
                    f"--> Custom logging: Set '{logger_name}' to {level_name.upper()}"
                )

            except ValueError:
                print(f"--> Error parsing log config: {config}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="UEC Diagnostic Hub",
    )

    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
        help="Host to listen on (default: 0.0.0.0)",
    )

    parser.add_argument(
        "--port",
        type=int,
        default=9000,
        help="Plaintext port to listen on (default: 9000)",
    )

    parser.add_argument(
        "--data-dir",
        type=str,
        default="data",
        help="Data directory path (default: data)",
    )

    args = parser.parse_args()
    host = args.host
    port = args.port
    data_dir = args.data_dir

    configure_logging()

    try:
        logging.info("Starting UEC Charging Station Diagnostic System...")
        asyncio.run(run(host, port, data_dir))
    except KeyboardInterrupt:
        logging.info("Shutting down UEC Charging Station Diagnostic System...")
        exit(0)
    except Exception as e:
        logging.error(f"Unexpected error: {e}", exc_info=True)
        exit(1)
