FROM node:19-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Port
EXPOSE 3000

# Start
CMD ["node", "server"]
