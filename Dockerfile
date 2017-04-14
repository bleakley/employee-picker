FROM node:6.9.2
EXPOSE 8080
COPY server.js .
COPY secrets.json .
COPY package.json .
RUN npm install
CMD npm start
