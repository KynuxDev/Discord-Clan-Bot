FROM node:18-alpine

LABEL maintainer="KynuxDev <https://github.com/KynuxDev>"
LABEL description="Discord Clan Bot - Smart Tag Tracking & Role Management"

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY .env.example ./

# Create data directory
RUN mkdir -p /app/data

# Non-root user for security
RUN addgroup -S botuser && adduser -S botuser -G botuser
RUN chown -R botuser:botuser /app
USER botuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "process.exit(0)"

CMD ["node", "src/index.js"]
