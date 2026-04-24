FROM node:18 AS frontend-build

WORKDIR /app/priceHistoryFrontend

COPY priceHistoryFrontend/package*.json ./
RUN npm install

COPY priceHistoryFrontend/ ./
RUN npm run build

FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
COPY --from=frontend-build /app/priceHistoryFrontend/dist ./public

EXPOSE 8080

CMD ["npm", "start"]