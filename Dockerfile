FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn --frozen-lockfile && yarn cache clean

EXPOSE 8000

CMD [ "yarn", "serve" ]
