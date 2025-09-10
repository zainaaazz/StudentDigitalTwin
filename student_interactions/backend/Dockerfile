FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY ./backend/package*.json ./
COPY ./backend/tsconfig.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source code and shared types
COPY ./backend/src/ ./src/
COPY ./shared ./shared

# Skip build for now - run with ts-node-dev
# RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

CMD ["npm", "run", "dev"]