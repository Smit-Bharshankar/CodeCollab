# Replace FROM line as needed (either latest or 22.04)
FROM ubuntu:22.04

WORKDIR /app

RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

ENV DEBIAN_FRONTEND=noninteractive

CMD ["bash"]
