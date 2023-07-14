FROM node:18.14-slim

WORKDIR /app/front-end

COPY package*.json ./
COPY .env ./.env

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]