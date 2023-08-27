FROM node:16

WORKDIR /app

COPY package.json ./app

RUN npm install

COPY ./src ./app

EXPOSE 8000
CMD ["npm", "run", "start:dev"]