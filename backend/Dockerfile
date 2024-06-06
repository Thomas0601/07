FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY wait-for-it.sh /wait-for-it.sh

EXPOSE 3000
CMD ["sh", "/wait-for-it.sh", "db", "node", "server.js"]
