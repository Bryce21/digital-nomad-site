FROM node:lts-slim as build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --quiet

COPY ./src ./src
COPY tsconfig.json ./
RUN ls
RUN npm run build


FROM node:lts-slim as production
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]