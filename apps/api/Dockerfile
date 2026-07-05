FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx run @org/api:prune

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/apps/api/dist ./
RUN npm ci --omit=dev
ENV NODE_ENV=production
CMD ["node", "main.js"]
