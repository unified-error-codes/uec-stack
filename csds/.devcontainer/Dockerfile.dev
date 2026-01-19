FROM debian:stable

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update
RUN apt install -y --no-install-recommends \
    mosquitto-clients \
    iproute2 \
    net-tools \
    clangd \
    unzip \
    cmake \
    wget \
    ca-certificates \
    sudo \
    build-essential \
    mosquitto \
    python3 \
    python-is-python3 \
    git \
    moreutils \
    python3-pip \
    python3.13-venv

# Add vscode user and give sudo access
RUN if ! id -u vscode > /dev/null 2>&1; then \
        useradd -m -s /bin/bash vscode; \
    fi \
    && mkdir -p /etc/sudoers.d \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

USER vscode

# Create and activate Python virtual environment
RUN python3 -m venv /home/vscode/venv

# Install Python packages in virtual environment
COPY requirements.txt /tmp/
RUN /home/vscode/venv/bin/pip install --upgrade pip setuptools wheel && \
    /home/vscode/venv/bin/pip install --no-cache-dir -r /tmp/requirements.txt

# Source venv on login
RUN echo "source /home/vscode/venv/bin/activate" >> /home/vscode/.bashrc
