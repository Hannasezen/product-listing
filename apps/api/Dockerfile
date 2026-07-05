FROM node:24-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx nx run @org/api:prune

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=build /app/apps/api/dist ./
RUN npm install --omit=dev
ENV NODE_ENV=production
CMD ["node", "main.js"]
