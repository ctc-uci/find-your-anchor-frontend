# ===============
# BUILD REACT APP
# ===============

FROM node:16.15.0-alpine as builder

# Set working dir
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Copies package.json and yarn.lock to Docker environment
COPY package.json .
COPY yarn.lock .

# Installs all node packages
RUN yarn install --production --frozen-lockfile

# Copies everything over to Docker environment
COPY . .

# Create the production build version of the  react app
RUN yarn build

# =========
# S3 UPLOAD
# =========

# Create a new container from a linux base image that has the aws-cli installed
FROM mesosphere/aws-cli

# Using the alias defined for the first container, copy the contents of the build folder to this container
COPY --from=builder /app/build .

# Set the default command of this container to push the files from the working directory of this container to our s3 bucket
CMD ["s3", "sync", "./", "s3://fya-frontend-deploy"]

# Uses port which is used by the actual application
# EXPOSE 3000

# Finally runs the application
# CMD [ "yarn", "start" ]

# Start container with: docker run -it --rm -p <outside port>:3000 --env-file ./.env <image name>
