
FROM node:21.2.0-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm install --save @types/multer
RUN npm run build

RUN npx prisma generate

CMD ["npm", "run", "start:migrate:prod"]
