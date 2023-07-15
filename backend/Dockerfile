FROM node:18.14-slim

WORKDIR /backend

COPY tsconfig.json ./
COPY package.json package-lock.json* ./
COPY .env ./.env
COPY . .
RUN apt-get update && apt-get install -y xdg-utils

RUN npm install
COPY ./prisma ./prisma
COPY script.sh ./
RUN chmod +x script.sh
CMD ["sh", "./script.sh"]