FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# The REPLICATE_API_TOKEN will be provided at runtime through smithery.yaml
# We don't hardcode it in the Dockerfile for security reasons

# Set the entrypoint
ENTRYPOINT ["node", "build/index.js"]
