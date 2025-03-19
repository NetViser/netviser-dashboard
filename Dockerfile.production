# ---- Build Stage ----
FROM node:20.15.1-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Accept build-time argument for NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build

# ---- Production Stage ----
FROM node:20.15.1-alpine AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

# Expose the port dynamically based on the PORT env variable
EXPOSE $PORT

# Start the application with the PORT environment variable
CMD npm start -- -p $PORT