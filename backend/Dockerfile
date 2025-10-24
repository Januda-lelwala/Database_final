FROM node:20-alpine

# Optional: tzdata helps with consistent time handling
RUN apk add --no-cache tzdata

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# Copy source
COPY . .

# Environment
ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
