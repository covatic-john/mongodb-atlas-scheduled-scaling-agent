########################################################################################################################
# Base build
########################################################################################################################
FROM node:18.14.0-alpine3.17 AS base-build

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install development and production modules
RUN rm -rf cicd && rm -rf coverage && rm -rf db && rm -rf documentation && rm -rf lib && rm -rf node_modules && npm install typescript@4.9.5 -g && npm install jest@29.4.3 -g && npm install

# Test and build the app
RUN jest --config jest.config.js && tsc

# cleanup and reinstall production modules
RUN rm -rf node_modules && npm install --only=production && rm -f .npmrc && rm -rf src && rm -rf tests

########################################################################################################################
# Final build
########################################################################################################################
FROM node:18.14.0-alpine3.17

# Create app directory
WORKDIR /usr/src/app

COPY --from=base-build /usr/src/app /usr/src/app

# Run the app
EXPOSE 3000
CMD [ "node", "lib/index.js" ]
