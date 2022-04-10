#!/bin/sh
# Print env vars
printenv

# Clones frontend PR branch
# git clone --branch $HEROKU_BRANCH $FRONTEND_CLONE

# Clones backend branch
git clone --branch dev $BACKEND_CLONE

echo "done git clone"
