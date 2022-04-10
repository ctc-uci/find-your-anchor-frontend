FROM node:lts-alpine

# Install git and curl
RUN apk --no-cache add git
RUN apk --no-cache add curl

# Run following commands in /app
WORKDIR /app

# Copy frontend code into docker container
# includes deployment-tasks.sh
COPY . .

# Install required packages
RUN yarn install --frozen-lockfile
