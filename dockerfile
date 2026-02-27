# STAGE 1: Build the Svelte Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# STAGE 2: Setup the Backend & Final Image
FROM node:20-slim
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Copy the BUILT frontend from the first stage
# This lands in /app/frontend/dist, matching your Express 'path.join' logic
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port your Express server uses
EXPOSE 1110

# Set the working directory to backend to run the server
WORKDIR /app/backend
CMD ["node", "server.js"]
