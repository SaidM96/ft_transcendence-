FROM node:18.14-slim

WORKDIR /app

COPY .env ./.env

COPY package.json package-lock.json* ./

RUN apt-get update && apt-get install -y xdg-utils

RUN npm install
COPY ./prisma ./prisma
COPY script.sh ./
RUN chmod +x script.sh
CMD ["sh", "./script.sh"]