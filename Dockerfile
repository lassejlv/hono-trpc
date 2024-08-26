FROM oven/bun:latest

WORKDIR /app
COPY . .

RUN bun install --no-save
RUN  bun build --compile --target=bun app.ts --outfile=server

RUN cd frontend && bun install && bun run build

CMD ["./server"]