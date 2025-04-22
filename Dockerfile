FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy all package and config files first
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code before installing to prevent TypeScript errors in prepare script
COPY src/ ./src/

# Install dependencies
RUN npm install

# Build the application (skip the prepare script which runs automatically with npm install)
# RUN npm run build  # This is already run by prepare script in package.json

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
