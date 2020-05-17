FROM node:12.6-alpine

RUN apk add --no-cache curl rtmpdump ffmpeg && \
    curl -o- -L https://yarnpkg.com/install.sh | sh && \
    yarn global add pm2 && \
    apk del curl

ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH
COPY . /service
WORKDIR /service
RUN yarn

RUN ln -fs /service/repo/config.yaml && \
    ln -fs /service/repo/.agserver

CMD yarn start && pm2 logs
