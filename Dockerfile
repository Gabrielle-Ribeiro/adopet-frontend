FROM node:20
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
ENTRYPOINT npm start