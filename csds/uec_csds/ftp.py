import aioftp
import os


class Ftp:
    def __init__(
        self,
        data_dir: str,
    ):
        self._server = aioftp.Server()
        self._working_dir = os.path.join(data_dir, "ftp")
        os.makedirs(self._working_dir, exist_ok=True)

    async def run(self):
        await self._server.start("0.0.0.0", 2121)
        await self._server.serve_forever()

    def get_location_url(self) -> str:
        [host, port] = self._server.address
        return f"ftp://{host}:{port}/{self._working_dir}/"

    def get_pathname(self, filename: str) -> str:
        return os.path.join(self._working_dir, filename)
