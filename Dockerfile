FROM alpine:latest
RUN apk add --no-cache git
RUN echo $HEROKU_BRANCH
# RUN git clone $
