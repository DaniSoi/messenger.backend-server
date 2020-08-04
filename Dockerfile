FROM node:13

WORKDIR /usr/src/app/

COPY ./package*.json ./

RUN npm install --production

COPY ./ ./

EXPOSE 5000

CMD npm run deploy
