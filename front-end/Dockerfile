FROM node:18.14-slim

WORKDIR /app

COPY package.json package-lock.json* ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]