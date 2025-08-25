# Use official Node.js LTS image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY express/package*.json ./express/

# Install backend dependencies
WORKDIR /app/express
RUN npm ci --production

# Copy backend source code
COPY express/src ./src

# Copy frontend package files
WORKDIR /app
COPY Frontend/Road2Skill/package*.json ./Frontend/Road2Skill/

# Install frontend dependencies
WORKDIR /app/Frontend/Road2Skill
RUN npm ci

# Copy frontend source code
COPY Frontend/Road2Skill ./

# Build frontend
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose backend port
EXPOSE 3001

# Start backend server
WORKDIR /app/express
CMD ["node", "src/index.mjs"]
