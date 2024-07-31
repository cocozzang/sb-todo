FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist dist
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/package.json package.json
COPY --from=build /app/package-lock.json package-lock.json

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c" ]
CMD ["npm run migration:run:prod && npm run start:prod"]
