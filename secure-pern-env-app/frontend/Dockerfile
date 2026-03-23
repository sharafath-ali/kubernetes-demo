# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server on all interfaces so the host can access it
CMD ["npm", "run", "dev", "--", "--host"]
