FROM node:18 as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install \
      --prefer-offline \
      --pure-lockfile \
      --non-interactive

COPY . .

RUN yarn build


FROM node:18-slim
WORKDIR /app
COPY --from=builder /app  .

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3000
EXPOSE 3000

CMD [ "yarn", "start" ]
