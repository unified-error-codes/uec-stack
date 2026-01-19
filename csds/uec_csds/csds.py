import asyncio
from .db.database import Database
from .ftp import Ftp
from .ocpp.server import Server as OCPPServer
from .engine import Engine
from .api.api import create_app
import uvicorn


async def run(host: str, port: int, data_dir: str):
    db = Database()
    app = create_app(db)
    ftp = Ftp(data_dir)
    engine = Engine(db)
    ocpp_server = OCPPServer(engine, ftp)

    config = uvicorn.Config(app=app, host="0.0.0.0", port=8000, log_level="info")
    api_server = uvicorn.Server(config)

    await asyncio.gather(ocpp_server.run(host, port), ftp.run(), api_server.serve())
