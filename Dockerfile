FROM node:lts-alpine

# Run following commands in /app
WORKDIR /app
# RUN apk add --no-cache git

# Clones frontend PR branch
RUN git clone --branch $HEROKU_BRANCH $FRONTEND_CLONE

# Clones backend branch
RUN git clone --branch dev $BACKEND_CLONE
