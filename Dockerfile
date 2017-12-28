# Start with the lightweight alpine version of node
FROM node:alpine

# Install Java
RUN apk --update add openjdk8
RUN ln -s /usr/lib/jvm/default-jvm/bin/javac /usr/bin/javac

# Create directory for sandbox writing
RUN mkdir /sandbox && chown node:node /sandbox

# Expose the application port
EXPOSE 3000

# Set the working directory
WORKDIR /home/node/app

# Copy the package.json file and install dependencies
COPY package*.json ./
RUN npm install

# Run the application on startup
CMD ["node", "server.js"]

# Configure development mode
ENV NODE_ENV development
ENV DEBUG javalearningtool-compiler:*

# Add all of the application files
COPY . .

# Set permissions on the home directory
RUN chown -R node:node /home/node

# Run as the unprivileged node user
USER node
