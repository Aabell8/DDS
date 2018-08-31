import React from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../helpers/withRoot";

const styles = {
  card: {
    height: 205,
    borderRadius: "4px 4px 0 0",
    position: "relative"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    color: "#4D4D4D",
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: "bold"
  },
  pos: {
    marginBottom: 12
  },
  newBadge: {
    float: "right",
    position: "relative",
    top: -20,
    right: -4
  },
  new: {
    color: "#4A90E2",
    fontFamily: "Helvetica",
    fontSize: 14
  },
  category: {
    height: 15,
    color: "#4D4D4D",
    fonFamily: "Helvetica",
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 5,
    opacity: 0.5
  },

  dateDiv: {
    height: 32,
    width: "100%",
    border: "1px solid #B3B3B3",
    backgroundColor: "#F7F7F7",
    opacity: 0.5,
    color: "#4D4D4D",
    textAlign: "center",
    verticalAlign: "middle",
    position: "absolute",
    bottom: 0
  },
  date: {
    fontFamily: "Helvetica",
    fontSize: 12,
    lineHeight: 2.5
  },
  gridRight: {
    textAlign: "center",
    height: 76,
    display: "flex",
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  gridLeft: {
    textAlign: "center",
    height: 76,
    verticalAlign: "middle",
    borderRight: "1px solid #D2D2D2",
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    color: "#4d4d4d",
    fontFamily: "Helvetica",
    fontSize: 14
  },
  cardContent: {
    paddingLeft: 15,
    paddingRight: 15
  },
  caseManager: {
    color: "#4D4D4D",
    fontFamily: "Helvetica",
    fontSize: 11
  }
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

class ClaimCard extends React.Component {
  getBadge() {
    const { classes, claim } = this.props;
    if (claim.isNew) {
      return (
        <div className={classes.newBadge}>
          <Typography className={classes.new}>NEW!</Typography>
        </div>
      );
    } else {
      return "";
    }
  }
  render() {
    const { classes, claim } = this.props;
    const date = claim.predicted_on.split("-");

    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography className={classes.title} color="textSecondary">
              Claim {claim.clm_num}
            </Typography>
            {this.getBadge()}

            <Typography className={classes.category} color="textSecondary">
              {claim.prim_diag_cat}
            </Typography>
            <Typography className={classes.caseManager} color="textSecondary">
              Case Mgr : {claim.cm_name}
            </Typography>
          </CardContent>
          <Grid container>
            <Grid item xs={6}>
              <div className={classes.gridLeft}>
                <Typography className={classes.content}>
                  {claim.top_ip}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.gridRight}>
                <Typography className={classes.content}>
                  {claim.second_ip}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <div className={classes.dateDiv}>
            <Typography className={classes.date}>
              Added {months[date[1] - 1]} {date[2]}, {date[0]}
            </Typography>
          </div>
        </Card>
      </div>
    );
  }
}

ClaimCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(ClaimCard));
