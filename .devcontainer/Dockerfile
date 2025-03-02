#ここではベースイメージという、構築する環境の基礎となるイメージをDockerHubなどから選び記述します。
#今回は、Ubuntuイメージを使用します
ARG VARIANT="hirsute"
FROM mcr.microsoft.com/vscode/devcontainers/base:${VARIANT}

#作成する環境の時間設定を日本時間にしておきます。これにより、ビルドが中断されなくなります。
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update && apt install -y nodejs npm
RUN npm install -g n
RUN n 20.9.0
RUN apt update && apt purge -y nodejs npm
RUN apt update && apt -y autoremove

CMD ["bash"]
