FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun install --no-save

RUN cd frontend && bun install && bun run build

CMD ["bun", "app.ts"]