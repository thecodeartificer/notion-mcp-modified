FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

FROM node:22.12-alpine AS release

WORKDIR /app

# Copy build artifacts and package files
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Copy .env file if it exists
COPY .env* ./

ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --ignore-scripts --omit=dev

# Environment variables can be overridden at runtime
ENV NOTION_TOKEN=""
ENV NOTION_PAGE_ID=""

# Use an unprivileged user
USER node

CMD ["node", "build/index.js"]
