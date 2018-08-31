# Disability Decision Support React app

This React app, bootstrapped with create-react-app, is used to show disability claim recommendations for all claims to allow case managers to provide feedback on those recommendations made by the machine learning algorithm. 

The app marks claims with new recommendations as NEW and allows the user to filter by case number, case manager name, or case manager ID. Claims can also be sorted by date in either descending or ascending order.

## Steps to install

1. Clone the repository:  
`git clone ...`
2. Go to folder created:  
`cd DDS-React`
3. Install dependencies:  
`npm install`
4. Run the server locally:  
`npm run start:local`
5. Environment variables
    - To run a different environment use  
`NODE_ENV=dev PORT=4000 npm start`
      - NODE_ENV={dev/uat/production}
      - PORT={port#}, runs local on specific port

## Steps to deploy (not valid)

Depending on which org needs to be deployed, the app name must be defined in the command to push the app, as defined below.

The `manifest.yml` file defines the configuration for PCF. For dev and uat it looks something like this:
```yml
---
applications:
#DEV
- name: disability-decision-support-react-dev
  memory: 1500M
  instances: 1
  command: NODE_ENV=dev npm run build:dev
  buildpack: nodejs_buildpack
  env:
    NODE_ENV: dev

#UAT
- name: disability-decision-support-react-uat
  host: disability-decision-support-react-uat
  instances: 1
  memory: 744M
  command: NODE_ENV=uat npm run build:uat
  buildpack: nodejs_buildpack
  env:
    NODE_ENV: uat
```

### Development:

1. login to PCF with:  
`cf login -a https://api.sys.cac.preview.pcf.manulife.com`
2. Use login credentials and choose the `REDLAB-DISABILITY-DECISION-SUPPORT-CAC-DEV-EXT` space
3. Navigate to the project folder and run:  
`cf push -f manifest.yml disability-decision-support-react-dev`  
which will use the manifest file as config to deploy the folder to PCF.

### UAT:

1. login to PCF with:  
`cf login -a https://api.sys.cac.pcf.manulife.com`
2. Use login credentials and choose the `REDLAB-DISABILITY-DECISION-SUPPORT-CAC-UAT-EXT` space
3. Navigate to the project folder and run:  
`cf push -f manifest.yml disability-decision-support-react-uat`  
which will use the manifest file as config to deploy the folder to PCF.

## Scripts

The scripts are as follows:

`start` - runs the express server to serve a built react project  
`start:local` - runs the react app locally in development mode  
`build` - Builds the react app for local usage (API uses port 5000)  
`build:{dev/uat/prod}` - Builds the react app in each deployment environment  
(running command `npm run build:dev` sets the API url to be the corresponding deployment url for the server)  
Each of these commands run `npm start` post build (For deployment reasons so it can be built and run on server)

