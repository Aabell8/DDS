const mliLogging = require("mli-logging");

const routesLogger = new mliLogging.ConsoleLogger(1, "DDS-Server:routes");

/**
 * This function performs a query that gets all unique claim numbers with
 * the most recent recommendation
 * @param {Object} sequelize - MySql database reference
 */
const getUniqueClaims = async function(sequelize, res) {
  const queryString =
    "SELECT " +
    "t1.id, t1.clm_num, t1.prim_diag_cat, " +
    "t1.predicted_on, t1.wsbsd, t1.top_ip, t1.second_ip, " +
    "t1.cm_id, t1.cm_name, aId1, Recommendation.aId2 " +
    "FROM Prediction AS t1 " +
    "LEFT OUTER JOIN Prediction AS t2 " +
    "ON t1.clm_num = t2.clm_num " +
    "AND (t1.predicted_on < t2.predicted_on " +
    "OR (t1.predicted_on = t2.predicted_on AND t1.id < t2.id)) " +
    "LEFT JOIN Recommendation on t1.id = Recommendation.predictionId " +
    "WHERE t2.clm_num IS NULL " +
    "GROUP BY t1.id, aId1, aid2 " +
    "ORDER BY t1.predicted_on DESC";
  let claims = [];
  await sequelize
    .query(queryString, { type: sequelize.QueryTypes.SELECT })
    .then(function(claimsData) {
      claims = claimsData;
    })
    .catch(function(err) {
      routesLogger.Debug(
        `Error in retrieving unique claims by claim numbers ${err}`
      );
      res.status(500).json({
        description: "error with query when getting unique claims",
        err
      });
      claims = 0;
    });
  return claims;
};

/**
 * This function gets all unique claim numbers and data and marks all ones with
 * an unreviewed claim with isNew = true
 * @param {Object} sequelize - Reference to MySql database
 * @param {Object} req - Request from client
 * @param {Object} res - Response to client object
 */
const getClaims = async function(sequelize, req, res) {
  const claimsPromise = getUniqueClaims(sequelize, res);

  const claims = await claimsPromise;

  if (claims === 0) {
    return 1;
  } else {
    // counts all claims that have a recommendation to be made
    let unreviewedCount = 0;
    claims.forEach(function(claim) {
      if (!claim.aId1 || !claim.aId2) {
        claim.isNew = true;
        unreviewedCount += 1;
      }
      delete claim.aId1;
      delete claim.aId2;
    });
    return res.json({ claims, unreviewedCount, hasMore: false });
  }
};

/**
 * This function gets all predictions for a specific claim number. Also attaches
 * the recommendation feedback data in the object, if it exists
 * @param {Object} sequelize - MySql database reference
 * @param {Object} req - Request from client
 * @param {Object} res - Response to client
 */
const getClaimData = function(sequelize, req, res) {
  const { clm_num } = req.params;
  const queryString =
    "SELECT t1.id, t1.predicted_on, t1.top_ip, t1.top_ip_prob, " +
    "t1.second_ip, t1.second_ip_prob, " +
    // "t1.cm_id, t1.cm_name " +
    "t3.pred AS pred1, " +
    "t3.val AS val1, t3.feedback AS feedback1, t4.pred AS pred2, " +
    "t4.val AS val2, t4.feedback AS feedback2 " +
    "FROM Prediction AS t1 " +
    "LEFT JOIN Recommendation t2 " +
    "ON t2.predictionID = t1.id " +
    "LEFT JOIN Action t3 " +
    "ON t2.aId1 = t3.aId " +
    "LEFT JOIN Action t4 " +
    "ON t2.aId2 = t4.aId " +
    `WHERE t1.clm_num=${clm_num} ` +
    "GROUP BY id, t3.pred, t3.val, t4.val, t3.feedback, " +
    "t4.feedback, t4.pred " + 
    "ORDER BY predicted_on DESC";
  // Claim # in req.query.params.claimNum
  sequelize
    .query(queryString, { type: sequelize.QueryTypes.SELECT })
    .then(function(claims) {
      res.json({ claims });
    })
    .catch(function(error) {
      routesLogger.Debug(`Error getting claim data: ${error}`);
      res.status(500).json({ error });
    });
};

const char_escape = function(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
    }
  });
};

/**
 * This function takes feedback data and puts it in the respective tables in
 * the database
 * @param {Object} sequelize - MySql database reference
 * @param {Object} req - Request from client
 * @param {Object} res - Response to client
 */
const putFeedback = async function(sequelize, req, res) {
  const p1 = req.body.pred1;
  const p2 = req.body.pred2;
  const queryString = "INSERT INTO Action (pred, val, feedback) VALUES ";
  const recommendString =
    "INSERT INTO Recommendation (predictionID, aId1, aId2) VALUES ";

  // Send request
  const p1Promise = sequelize.query(
    queryString + `('${p1.pred}', '${p1.val}', '${char_escape(p1.feedback)}')`,
    {
      type: sequelize.QueryTypes.INSERT
    }
  );
  const p2Promise = sequelize.query(
    queryString + `('${p2.pred}', '${p2.val}', '${char_escape(p2.feedback)}')`,
    {
      type: sequelize.QueryTypes.INSERT
    }
  );
  // Await two action insert promises
  const p1Res = await p1Promise;
  const p2Res = await p2Promise;
  // Get ids for inserted promises
  if (p1Res[0] && p2Res[0]) {
    await sequelize
      .query(recommendString + `(${req.body.id}, ${p1Res[0]}, ${p2Res[0]})`)
      .then(function(item) {
        res.status(200).json({
          success: true,
          item
        });
      })
      .catch(function(error) {
        routesLogger.Debug(
          `Error entering Recommendation in table with valid actions: ${error}`
        );
        res.status(500).json({
          success: false,
          error
        });
      });
  } else {
    routesLogger.Debug(
      `Actions were not added successfully: First ID: ${p1Res[0]} Second ID: ${
        p2Res[0]
      }`
    );
    res.status(500).json({
      success: false
    });
  }
};

const routes = function(app) {
  const { CLAIMS_PATH, CLAIM_PATH, FEEDBACK_PATH } = global.config;
  const sequelize = app.get("sequelizeClient");

  app.get(CLAIMS_PATH, function(req, res) {
    getClaims(sequelize, req, res);
  });

  app.get(CLAIM_PATH, function(req, res) {
    getClaimData(sequelize, req, res);
  });

  app.put(FEEDBACK_PATH, function(req, res) {
    putFeedback(sequelize, req, res);
  });
};

module.exports = routes;
