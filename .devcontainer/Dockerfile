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
    apt-file \
    libboost1.88-dev \
    mosquitto \
    rapidjson-dev \
    python3 \
    python-is-python3 \
    git \
    opentelemetry-cpp-dev \
    libabsl-dev \
    libgrpc++-dev \
    pkg-config \
    protobuf-compiler-grpc \
    moreutils \
    && apt-file update

# Install latest Opentelemetry C++ with ABI v2 support
RUN git clone https://github.com/open-telemetry/opentelemetry-cpp.git /tmp/opentelemetry-cpp \
 && cmake -S /tmp/opentelemetry-cpp -B /tmp/opentelemetry-cpp/build -DWITH_ABI_VERSION_2=ON -DWITH_ABI_VERSION_1=OFF \
 && make -C /tmp/opentelemetry-cpp/build -j$(nproc) \
 && make -C /tmp/opentelemetry-cpp/build install \
 && rm -rf /tmp/opentelemetry-cpp

 # Install C++ MQTT
RUN wget -O /tmp/mqtt5-master.zip \
    https://github.com/boostorg/mqtt5/archive/refs/heads/master.zip \
 && unzip /tmp/mqtt5-master.zip -d /tmp/ \
 && cp -a /tmp/mqtt5-master/include/boost /usr/local/include/ \
 && rm -rf /tmp/mqtt5-master /tmp/mqtt5-master.zip

RUN if ! id -u vscode > /dev/null 2>&1; then \
        useradd -m -s /bin/bash vscode; \
    fi \
    && mkdir -p /etc/sudoers.d \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

USER vscode
