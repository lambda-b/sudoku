# ここではベースイメージという、構築する環境の基礎となるイメージをDockerHubなどから選び記述します。
# 今回は、Ubuntuイメージを使用します
ARG VARIANT="jammy"
FROM mcr.microsoft.com/devcontainers/base:${VARIANT}

# 作成する環境の時間設定を日本時間にしておきます。これにより、ビルドが中断されなくなります。
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Node.js環境のセットアップ
ARG NODE_VERSION="24.12.0"
RUN apt update && apt install -y nodejs npm
RUN npm install -g n
RUN n ${NODE_VERSION}
RUN apt update && apt purge -y nodejs npm
RUN apt update && apt -y autoremove

# AWS CLI のインストール (CDK実行に便利)
# ARM64環境向け
# RUN apt update && apt install -y curl unzip && \
#   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
#   unzip awscliv2.zip && \
#   ./aws/install && \
#   rm -rf awscliv2.zip aws

# Apple Silicon向け
RUN apt update && apt install -y curl unzip && \
  curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf awscliv2.zip aws

# Graphviz のインストール (CDK構成図生成に必要)
RUN apt update && apt install -y graphviz

CMD ["bash"]
