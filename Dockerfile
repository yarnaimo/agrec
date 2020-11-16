FROM node:12.6-alpine

RUN apk add --no-cache curl ffmpeg && \
    curl -o- -L https://yarnpkg.com/install.sh | sh && \
    yarn global add pm2 && \
    apk del curl

ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH
WORKDIR /service
COPY package.json yarn.lock ./
RUN yarn --ignore-scripts

COPY . .
RUN yarn prepare

RUN ln -fs /service/repo/config.yaml && \
    ln -fs /service/repo/.agstream

CMD yarn start && pm2 logs
