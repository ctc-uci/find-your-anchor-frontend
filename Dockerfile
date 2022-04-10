# Backend github repo vars
ARG GH_BRANCH="dev"
ARG GH_USER="ctc-uci"
ARG GH_REPO="find-your-anchor-backend"

FROM node:lts-alpine

# Install git and curl
RUN apk --no-cache add git
RUN apk --no-cache add curl

# Run following commands in /app
WORKDIR /app

# Copy frontend code into docker container
# includes deployment-tasks.sh
COPY . .

# Download backend code, move into ./backend folder
RUN echo "Downloading from https://github.com/${GH_USER}/${GH_REPO}/archive/${GH_BRANCH}.zip"
RUN wget "https://github.com/${GH_USER}/${GH_REPO}/archive/${GH_BRANCH}.zip" -O temp.zip; unzip ./temp.zip; rm ./temp.zip
RUN mv ./$GH_REPO-$GH_BRANCH ./backend

# Install required packages
RUN yarn install --frozen-lockfile
RUN cd backend && yarn install --frozen-lockfile
