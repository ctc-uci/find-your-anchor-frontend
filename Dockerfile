FROM node:lts-alpine

# Install git and curl
RUN apk --no-cache add git
RUN apk --no-cache add curl

# Run following commands in /app
# WORKDIR /app

# Copy deployment task script
COPY ./deployment-tasks.sh .
