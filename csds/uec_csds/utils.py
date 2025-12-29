import zipfile


def read_diagnostic_file(pathname: str) -> str:
    if zipfile.is_zipfile(pathname):
        return _read_zip_file(pathname)
    with open(pathname, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def _read_zip_file(pathname: str) -> str:
    with zipfile.ZipFile(pathname, "r") as zip_ref:
        content = []
        for name in zip_ref.namelist():
            with zip_ref.open(name) as file:
                content.append(file.read().decode("utf-8", errors="ignore"))
        return "\n".join(content)
