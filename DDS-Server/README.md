# Disability Decision Support express Server

This express app is the backend server API to allow the React app to interact with the MySql database data.

To start the app locally, run  
`npm start`

This will trigger server.js which will set up the API routes in routes.js.

## Steps to install

1. Clone the repository:  
`git clone ...`
2. Go to folder created:  
`cd DDS-Server`
3. Install dependencies:  
`npm install`
4. Run the server locally:  
`npm start`
5. Environment variables
    - To run a different environment use  
`NODE_ENV=dev PORT=4000 npm start`
      - NODE_ENV={dev/uat/production}
      - PORT={port#}, runs local on specific port

## Setting up database

1. Use the sql script `ddsdb.sql` to dump the test data into the database  
`mysql -h <host> -u <username> -p dds < ddsdb.sql`
2. Change the intended database in the server file on like 32 as follows:  
`let sequelize = new Sequelize("dds", "<username>", "<password>", {`

## API usage

The API endpoints are as follows:  

`/api/claims` - GET: Function returns all unique claims data to the react app  
`/api/claims/:clm_num` - GET: Function returns all recommendation data for specific claim  
`/api/feedback` - PUT: Function posts a recommendation feedback to the database  

## Steps to deploy (not valid)

Depending on which org needs to be deployed, the app name must be defined in the command to push the app, as defined below.

The `manifest.yml` file defines the configuration for PCF. For dev and uat it looks something like this:
```yml
---
applications:
#DEV
- name: disability-decision-support-server-dev
  memory: 128M
  instances: 1
  command: NODE_ENV=dev npm start
  buildpack: nodejs_buildpack
  env:
    NODE_ENV: dev

#UAT
- name: disability-decision-support-server-uat
  host: disability-decision-support-server-uat
  instances: 1
  memory: 128M
  command: NODE_ENV=uat npm start
  buildpack: nodejs_buildpack
  env:
    NODE_ENV: uat
```

### Development:

1. login to PCF with:  
`cf login -a https://api.sys.cac.preview.pcf.manulife.com`
2. Use login credentials and choose the `REDLAB-DISABILITY-DECISION-SUPPORT-CAC-DEV-EXT` space
3. Navigate to the project folder and run:  
`cf push -f manifest.yml disability-decision-support-server-dev`  
which will use the manifest file as config to deploy the folder to PCF.

### UAT:

1. login to PCF with:  
`cf login -a https://api.sys.cac.pcf.manulife.com`
2. Use login credentials and choose the `REDLAB-DISABILITY-DECISION-SUPPORT-CAC-UAT-EXT` space
3. Navigate to the project folder and run:  
`cf push -f manifest.yml disability-decision-support-server-uat`  
which will use the manifest file as config to deploy the folder to PCF.

## Scripts

In `package.json` there is only one script to be run for this project which is:
```json
"start": "node .",
```
This runs node to start the server as the server file is defined as main here:
```json
"main": "./src/server.js",
```

