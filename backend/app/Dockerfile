FROM node:current

WORKDIR /dist
COPY package.json .
RUN npm install
COPY . .
CMD npm start
