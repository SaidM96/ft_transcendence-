FROM node:18.14-slim

WORKDIR /front-end

COPY package.json package-lock.json* ./
COPY .env ./.env

COPY . .

# RUN npm install -g next
# RUN npm run build
EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]