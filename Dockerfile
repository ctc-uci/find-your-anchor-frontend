FROM alpine:latest
RUN apk add --no-cache git
RUN echo $HEROKU_BRANCH
RUN echo $HEROKU_PR_NUMBER
# RUN git clone $
