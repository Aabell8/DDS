import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Paper, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import withRoot from "../../helpers/withRoot";
import "./recommendationCard.css";
import ReactSpeedometer from "react-d3-speedometer";
import Tooltip from "@material-ui/core/Tooltip";
import ime from "../../assets/ime_report.svg";
import dds from "../../assets/disability_specialist_review.svg";
import fRehab from "../../assets/functional_rehab.svg";
import conRev from "../../assets/md_consultation_review.svg";
import report from "../../assets/md_report.svg";
import survillience from "../../assets/survillience.svg";
import noInv from "../../assets/no_intervention.svg";
import vRehab from "../../assets/vocational_rehab.svg";

const assetMap = {
  "IME Report": ime,
  "Disability Specialist Review/MHS Ref": dds,
  "Functional Rehab": fRehab,
  "Vocational Rehab": vRehab,
  Survillience: survillience, //Does not exist in test data
  "No Intervention": noInv,
  "MD Consultation Review": conRev,
  "MD Report": report
};

const styles = (theme) => {
  return {
    root: {
      margin: 15,
      flexGrow: 1
    },
    rightIcon: {
      marginLeft: theme.spacing.unit
    },
    cardIcon: {
      width: 48,
      height: 48
    },
    paper: {
      width: 190
    },
    grid: {
      marginTop: 28
    },
    info: {
      position: "relative",
      left: 40,
      zIndex: 10000,
      fontSize: 14,
      opacity: 0.75
    }
  };
};

class RecommendationCard extends React.Component {
  getValue(value) {
    if (value <= 30) {
      return "LOW";
    }
    if (value > 30 && value <= 70) {
      return "MED";
    }

    if (value > 70) {
      return "HIGH";
    } else {
      return "";
    }
  }
  getTooltipText() {
    return (
      <div>
        LOW : This intervention
        <br />
        had limited success
        <br />
        based on similar
        <br />
        historical data.
        <br />
        <br />
        MED : This intervention
        <br />
        had moderate success
        <br />
        based on similar
        <br />
        historical data.
        <br />
        <br />
        HIGH : This intervention
        <br />
        had significant success
        <br />
        based on similar
        <br />
        historical data.
        <br />
      </div>
    );
  }

  spedometerComponent(confidence) {
    return (
      <ReactSpeedometer
        minValue={0}
        maxValue={100}
        segments={100}
        needleColor="#4D4D4D"
        value={confidence * 100}
        textColor="#FFFFFF"
        startColor="#FDFC47"
        endColor="#24FE41"
        width={150}
        height={85}
        ringWidth={20}
        currentValueText=""
      />
    );
  }

  render() {
    const { classes, prediction, value, onButtonClick, num } = this.props;
    if (!prediction) {
      return (
        <div className={classes.root}>
          <Paper className="paper">No Data available</Paper>
        </div>
      );
    }
    let yesStyle,
      noStyle = "";
    if (value.answer === "yes") {
      yesStyle = "selected";
    }
    if (value.answer === "no") {
      noStyle = "selected";
    }
    return (
      <div className={`card ${value.status}Card`}>
        <Paper className={"paper " + value.status}>
          <div>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                spacing={16}>
                <Grid item className={`image ${value.status}Image`}>
                  <div className={classes.cardIcon}>
                    <img src={assetMap[prediction.prediction]} alt="" />
                  </div>
                </Grid>
                <Grid item>
                  <Typography variant="body2" className="predictionText">
                    {prediction.prediction}
                  </Typography>
                </Grid>
                <Tooltip
                  id="tooltip-right"
                  title={this.getTooltipText()}
                  placement="right">
                  <Icon className={classes.info}>info</Icon>
                </Tooltip>
                <Grid
                  item
                  style={{
                    padding: "0px 10px 30px 10px",
                    position: "relative",
                    top: -15
                  }}>
                  {this.spedometerComponent(prediction.confidence)}
                  <Typography
                    variant="caption"
                    align="center"
                    style={{
                      margin: "0px 0px 0px 0px"
                    }}>
                    {this.getValue(Math.round(prediction.confidence * 100))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Grid container justify="center">
            <Grid item xs={6}>
              <Button
                className={`button ${yesStyle}`}
                onClick={() => {
                  return onButtonClick(num, "yes");
                }}>
                Yes
                <Icon className={classes.rightIcon}>thumb_up</Icon>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                className={`noButton ${noStyle}`}
                onClick={() => {
                  return onButtonClick(num, "no");
                }}>
                No
                <Icon className={classes.rightIcon}>thumb_down</Icon>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

RecommendationCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(RecommendationCard));
