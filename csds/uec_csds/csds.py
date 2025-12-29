import asyncio

from .ftp import Ftp
from .ocpp.server import Server
from .engine import Engine


async def run(host: str, port: int, data_dir: str):
    ftp = Ftp(data_dir)
    engine = Engine(data_dir)
    server = Server(engine, ftp)

    await asyncio.gather(server.run(host, port), ftp.run())
