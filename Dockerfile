FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_API_URL=""

RUN npm run build

RUN ls -la dist/ || echo "dist nie istnieje"
RUN cat dist/index.html || echo "index.html nie istnieje"

EXPOSE 3000

CMD ["npm", "start"]