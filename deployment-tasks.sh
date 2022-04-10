#!/bin/sh
echo "Starting deployment-tasks.sh"

# Print env vars
# printenv

# Clones frontend PR branch
# git clone --branch $HEROKU_BRANCH $FRONTEND_CLONE

# Clones backend branch
# git clone --branch dev $BACKEND_CLONE

# Use CURL to download backend
curl https://github.com/ctc-uci/find-your-anchor-backend/archive/refs/heads/dev.zip server.zip

echo "Done deployment-tasks.sh"
