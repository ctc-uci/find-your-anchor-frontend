FROM node:lts-alpine

# Install git
RUN apk add --no-cache git

# Run following commands in /app
WORKDIR /app

# Clones frontend PR branch
RUN git clone --branch $HEROKU_BRANCH $FRONTEND_CLONE

# Clones backend branch
RUN git clone --branch dev $BACKEND_CLONE
