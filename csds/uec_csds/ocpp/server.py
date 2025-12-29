import logging
from .charge_point_v16 import ChargePoint16
import websockets

from ..ftp import Ftp
from ..engine import Engine


class Server:
    def __init__(self, engine: Engine, ftp: Ftp):
        self._engine = engine
        self._ftp = ftp

    async def run(self, host="0.0.0.0", port=9000):
        server = await websockets.serve(
            self.on_connect, host, port, subprotocols=["ocpp1.6"]
        )
        await server.wait_closed()

    async def on_connect(self, websocket, path):
        try:
            requested_protocols = websocket.request_headers["Sec-WebSocket-Protocol"]
        except KeyError:
            logging.error("Client hasn't requested any Subprotocol. Closing Connection")
            return await websocket.close()
        if websocket.subprotocol:
            logging.info("Protocols Matched: %s", websocket.subprotocol)
        else:
            logging.warning(
                "Protocols Mismatched | Expected Subprotocols: %s,"
                " but client supports  %s | Closing connection",
                websocket.available_subprotocols,
                requested_protocols,
            )
            return await websocket.close()

        if websocket.subprotocol == "ocpp1.6":
            charge_point_id = path.strip("/")
            logging.info(f"{charge_point_id} connected using OCPP1.6")
            cp = ChargePoint16(
                self._ftp,
                self._engine,
                charge_point_id,
                websocket,
            )
            await cp.start()
