
FROM node:21.2.0-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm install --save @types/multer

RUN npm i bcrypt@5.0.0
RUN npm i -D @types/bcrypt
RUN npm i request && npm i node-pre-gyp
RUN apk add --no-cache python3 make g++

RUN npm run build

RUN npx prisma generate

CMD ["npm", "run", "start:migrate:prod"]
