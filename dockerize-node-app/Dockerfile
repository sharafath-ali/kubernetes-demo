# Step 1: Use official Node.js image as base
FROM node:18-alpine

# Step 2: Set working directory inside the container
# WORKDIR /app is equivalent to: mkdir -p /app && cd /app
# - Creates /app directory if it doesn't exist
# - All following commands (COPY, RUN, CMD) run from inside /app
#
# Without WORKDIR, files land at / (root) — RISKY because:
#   - / already has system folders: /bin, /etc, /usr, /lib ...
#   - Your app.js and node_modules would mix with OS files
#   - You could accidentally overwrite system files with COPY
#
# With WORKDIR /app — clean and isolated:
#   /app/app.js         ← your code
#   /app/package.json
#   /app/node_modules/
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
