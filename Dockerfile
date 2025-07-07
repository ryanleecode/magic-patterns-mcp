# Build stage - Use official Bun image for optimal performance
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build standalone executable using Bun's native compilation
# Use --minify and --sourcemap for production optimization
RUN bun build src/main.ts --compile --minify --sourcemap --outfile=magic-patterns-mcp

# Production stage - Use distroless for minimal attack surface
FROM gcr.io/distroless/base-debian12 AS production

WORKDIR /app

# Copy the compiled executable from builder stage
COPY --from=builder /app/magic-patterns-mcp ./magic-patterns-mcp

# Run as non-root user for security
USER nonroot:nonroot

# Add labels for the renamed project
LABEL org.opencontainers.image.title="magic-patterns-mcp"
LABEL org.opencontainers.image.description="Magic Patterns MCP Server - stdio-based server for AI integration"
LABEL org.opencontainers.image.vendor="Magic Patterns"
LABEL org.opencontainers.image.source="https://github.com/magic-patterns/magic-patterns-mcp"

# Health check - since this is a stdio-based MCP server, we check if the binary executes
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ./magic-patterns-mcp --help > /dev/null 2>&1 || exit 1

# Start the MCP server (stdio-based, no port needed)
CMD ["./magic-patterns-mcp"]
