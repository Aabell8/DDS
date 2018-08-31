const express = require("express");
const mliConfiguration = require("mli-configuration");
const mliLogging = require("mli-logging");
const resolve = require("path").resolve;

const apiLogger = new mliLogging.ConsoleLogger(1, "DDSReactServer");
const configuration = new mliConfiguration.ConfigurationProvider(
  process.env["server.js"],
  process.env.NODE_ENV,
  apiLogger
);

const app = express();
const port = process.env.PORT || 9000;

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

  app.use(express.static(resolve(process.cwd(), "build")));

  logger.Debug(JSON.stringify(global.config, null, 4));
};

const setupRoutes = function() {
  const logger = new mliLogging.ConsoleLogger(
    global.config.LOGGING_LEVEL,
    "server.js:SetupRoutes"
  );
  app.get("/*", function(req, res) {
    res.sendFile(resolve(process.cwd(), "build", "index.html"));
  });
  app.listen(port, () => {
    return logger.Debug(`Server started at: ${port}`);
  });
};

const runServer = async function() {
  await initializeEnvironment();
  setupRoutes();
};

runServer();
