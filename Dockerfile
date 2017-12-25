# Start with the lightweight alpine version of node
FROM node:alpine

# Create directory for sandbox writing
RUN mkdir /sandbox && chown node:node /sandbox

# Install Java
RUN apk --update add openjdk8
RUN ln -s /usr/lib/jvm/default-jvm/bin/javac /usr/bin/javac

# Set the working directory
WORKDIR /home/node/app

# Expose the application port
EXPOSE 3000

# Run as the unprivileged node user
USER node

# Run the application on startup
CMD ["npm", "start"]

# Configure development mode
ENV NODE_ENV development

# Add all of the application files
COPY ./ /home/node/app/
