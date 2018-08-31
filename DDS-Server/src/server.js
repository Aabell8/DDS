const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");

const mliConfiguration = require("mli-configuration");
const mliLogging = require("mli-logging");

const app = express();
const Sequelize = require("sequelize");

app.use(cors());
const port = process.env.PORT || 5000;

const apiLogger = new mliLogging.ConsoleLogger(1, "DDS-Server");
const configuration = new mliConfiguration.ConfigurationProvider(
  process.env["server.js"],
  process.env.NODE_ENV,
  apiLogger
);

const setupDatabase = function() {
  // let sequelizeUri =
  //   "mysql://Cx5uuZ34vHxfNVWR:uw2Ih3Md9q8UJKwn@10.237.253.6:3306/" +
  //   "cf_c43c5dd9_9c46_4937_a206_6e3dd29e5726?reconnect=true";

  // UAT
  // "mysql://pTIB1kMgfmFEVpmT:n2YNMc8fRKvTBMky@10.237.252.6:3306/" +
  // "cf_7b35b16c_5786_42da_8a98_092ab825b7cf?reconnect=true";

  const Op = Sequelize.Op;
  let sequelize = new Sequelize('dds', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
    operatorsAliases: Op
  });

  if (process.env.VCAP_SERVICES) {
    apiLogger.Debug("Connecting to pcf specific mysql Database");
    const vcap_services = JSON.parse(process.env.VCAP_SERVICES);
    const mysqlDb = vcap_services["p-mysql"][0];
    if (mysqlDb) {
      sequelizeUri = mysqlDb.credentials.uri;

      sequelize = new Sequelize(sequelizeUri, {
        logging: false,
        operatorsAliases: Op
      });
    }
  }

  sequelize
    .authenticate()
    .then(() => {
      apiLogger.Debug("Connection has been established successfully.");
    })
    .catch((err) => {
      apiLogger.Debug("Unable to connect to the database:", err);
    });

  app.set("sequelizeClient", sequelize);
};

const checkEnvironment = function() {
  switch (process.env.NODE_ENV) {
    case "local":
      return "DEFAULT";
    case "dev":
      return "DEV";
    case "qa":
      return "QA";
    case "uat":
      return "UAT";
    case "prod":
    case "production":
      return "PROD";
    default:
      return "DEFAULT";
  }
};

const initializeEnvironment = async function() {
  global.config = await configuration.Load();
  const environment = checkEnvironment();
  global.config = global.config[environment];

  const logger = new mliLogging.ConsoleLogger(
    global.config.LOGGING_LEVEL,
    "server.js:InitializeEnvironment"
  );

  logger.Debug(JSON.stringify(global.config, null, 4));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
};

const setupRoutes = function() {
  const logger = new mliLogging.ConsoleLogger(
    global.config.LOGGING_LEVEL,
    "server.js:SetupRoutes"
  );
  routes(app);
  app.listen(port, () => {
    return logger.Debug(`Server started at: ${port}`);
  });
};

const runServer = async function() {
  await initializeEnvironment();
  setupDatabase();
  setupRoutes();
};

runServer();
