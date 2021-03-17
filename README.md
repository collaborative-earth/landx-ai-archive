# Landx-AI

This repo is the repo for what is hosted on landx.ai. This project was boostrapped with Create React App.

## Technical Stack

This project uses the npm version specified in the `.nvmrc` file.
This application use React for making the screens.
React Router will be used for frontend routing.
Bulma is the UI library for this repository.

## Environments

The variables for this project are stored in the `/config` folder. Currently, there is a local config, and dev config. Yarn start will copy the local
config to `config.json` in the `/public` folder. These values are then accessible in the application, and can be easily changed by overwriting config.json with
whatever environment we want to deploy.

## Running the application

After changing to the appropriate npm version, install all the dependencies using `yarn install`. To run the application in development mode, use `yarn start`.
NOTE: **Do Not** use npm commands.

## Temporary

`index.html` is maintained independent of the react app until we can transition all work and github pages to react.
