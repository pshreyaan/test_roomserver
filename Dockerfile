# Deno - See https://github.com/denoland/deno_docker
FROM denoland/deno:2.0.6
EXPOSE 8081
WORKDIR /app
USER deno

COPY deno.json deno.lock ./
RUN deno install

COPY . .
RUN deno cache src/main.ts

CMD ["deno", "task", "start"]
