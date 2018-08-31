import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withRoot from "../../helpers/withRoot";
import { Icon } from "@material-ui/core";

const styles = () => {
  return {
    heading: {
      fontSize: 12,
      fontWeight: "bold"
    },
    panel: {
      backgroundColor: "#F9F9F9",
      width: 850,
      border: "1px solid #979797"
    },
    root: {
      width: "100%",
      overflowX: "auto"
    },
    table: {
      minWidth: 400
    },
    data: {
      fontSize: 11,
      fontFamily: "Helvetica",
      color: "#4D4D4D",
      marginBottom: 5,
      padding: 10,
      display: "flex"
    },
    header: {
      marginBottom: 5,
      padding: 10,
      fontSize: 12,
      opacity: 0.5,
      fontFamily: "Helvetica"
    },
    feedback: {
      fontStyle: "italic"
    },
    predData: {
      paddingBottom: 10
    }
  };
};

class PastActivity extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      claims: []
    };
  }

  tableHeader() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={2} className={classes.header}>
          DATE
        </Grid>
        <Grid item xs={10} className={classes.header}>
          <Grid container>
            <Grid item xs={3}>
              INTERVENTION
            </Grid>
            <Grid item xs={2}>
              CONFIDENCE
            </Grid>
            <Grid item xs={2}>
              HELPFUL?
            </Grid>
            <Grid item xs={5}>
              COMMENTS
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const { classes, pastFeedback } = this.props;
    return (
      <div className={classes.root}>
        <ExpansionPanel className={classes.panel}>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
            <Typography className={classes.heading}>
              VIEW HISTORY OF INTERVENTION SUGGESTIONS FOR THIS CASE
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container className={classes.table}>
              {this.tableHeader()}
              {pastFeedback.map((element) => {
                return (
                  <Grid container key={element.id}>
                    <Grid item xs={2} className={classes.data}>
                      {element.predicted_on}
                    </Grid>
                    <Grid item xs={10} className={classes.data}>
                      <Grid container spacing={8}>
                        <Grid item xs={3} className={classes.predData}>
                          {element.pred1}
                        </Grid>
                        <Grid item xs={2}>
                          {`${Math.round(element.top_ip_prob * 100)}%`}
                        </Grid>
                        <Grid item xs={2}>
                          {element.val1}
                        </Grid>
                        <Grid item xs={5}>
                          {element.feedback1}
                        </Grid>
                        <Grid item xs={3}>
                          {element.pred2}
                        </Grid>
                        <Grid item xs={2}>
                          {`${Math.round(element.second_ip_prob * 100)}%`}
                        </Grid>
                        <Grid item xs={2}>
                          {element.val2}
                        </Grid>
                        <Grid item xs={5}>
                          {element.feedback2}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

PastActivity.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(PastActivity));
