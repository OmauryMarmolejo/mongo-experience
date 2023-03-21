FROM node:13-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=password 

RUN mkdir -p /home/app

COPY ./app /home/app

WORKDIR /home/app

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]