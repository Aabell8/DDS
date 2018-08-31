# Disability Decision Support

This is an app that is used to show disability claim recommendations for all claims to allow case managers to provide feedback on those recommendations made by a machine learning algorithm. 

The app marks claims with new recommendations as NEW and allows the user to filter by case number, case manager name, or case manager ID. Claims can also be sorted by date in either descending or ascending order.

## Steps to install

1. Clone the repository:  
`git clone ..`
2. Go to folder created:  
`cd DDS`
3. Install dependencies:  
`npm install`
4. Run the React app and server locally:  
`npm start`

## Scripts

The scripts are as follows:

`start` - runs the express server and React app through react-scripts  
`client` - runs the React app in dev mode  
`build:client` - builds the React app for production  
`server` - runs the backend express server  
`build` - Builds the react app for local usage (Accessible through port 9000)  
