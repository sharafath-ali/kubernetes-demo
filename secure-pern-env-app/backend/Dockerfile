# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies FIRST (for caching)
COPY package.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose API port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
