#!/bin/sh

# Github repo vars
GH_BRANCH="dev"
GH_USER="ctc-uci"
GH_REPO="find-your-anchor-backend"

echo "Starting deployment-tasks.sh"

# Print env vars
# printenv

# Clones frontend PR branch
# git clone --branch $HEROKU_BRANCH $FRONTEND_CLONE

# Clones backend branch
# git clone --branch dev $BACKEND_CLONE

# Use CURL to download backend
wget https://github.com/${GH_USER}/${GH_REPO}/archive/${GH_BRANCH}.zip -O temp.zip
unzip ./temp.zip
rm ./temp.zip
mv ./${GH_REPO}-${GH_BRANCH} ./backend

# curl https://github.com/ctc-uci/find-your-anchor-backend/archive/refs/heads/dev.zip -L --output server.zip

echo "Done deployment-tasks.sh"
