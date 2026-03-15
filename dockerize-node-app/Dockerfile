# Step 1: Use official Node.js image as base
FROM node:18-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json first (to cache npm install layer)
COPY package.json .

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app code
COPY . .

# Step 6: Expose the port the app runs on
EXPOSE 3000

# Step 7: Command to start the app
CMD ["node", "app.js"]
