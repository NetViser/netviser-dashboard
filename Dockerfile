# Single stage for local development
FROM node:20.15.1-alpine

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy all application code
COPY . .

# Set development environment variables
ENV NODE_ENV=development
ENV NEXT_PUBLIC_ENV=local
ENV PORT=3000

# Expose the development port
EXPOSE 3000

# Start the Next.js development server with hot reloading
CMD ["npm", "run", "dev"]