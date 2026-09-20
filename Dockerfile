FROM alpine:3.24.2

WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN apk add caddy && \
    apk add nodejs && \
    apk add npm && \
    apk add curl

COPY . .

COPY Caddyfile /etc/caddy/Caddyfile 

RUN npm i && \
    npm run build

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
