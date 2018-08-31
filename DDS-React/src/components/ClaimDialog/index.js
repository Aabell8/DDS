import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  CircularProgress
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import withRoot from "../../helpers/withRoot";
import { getClaimData } from "../../actions/claimsActions";
import { connect } from "react-redux";
import ClaimContent from "./ClaimContent";
import BlankCard from "../BlankCard";
import PastActivity from "../PastActivity";

const styles = {
  head: {
    border: "1px solid #979797",
    borderRadius: "2px 2px 0 0",
    backgroundColor: "#F0F0F0",
    height: 73,
    paddingTop: 3
  },
  claimText: {
    color: "#4A4A4A",
    fontFamily: "Helvetica",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 3,
    marginTop: 20,
    marginLeft: 42
  },
  claimDetails: {
    justifyContent: "center"
  },
  category: {
    color: "#4A4A4A",
    fontFamily: "Helvetica",
    fontSize: 14,
    marginLeft: 42,
    marginTop: 5
  },
  weeks: {
    color: "#4A4A4A",
    fontFamily: "Helvetica",
    fontSize: 12,
    marginRight: 31,
    float: "right"
  },

  panel: {
    border: "1px solid",
    boxShadow: "0 2px 1px 0 rgba(0,0,0,0.17)",
    borderColor: "#FFF3E0",
    width: 620
  },
  info: {
    lineHeight: 3,
    fontSize: 12,
    height: 0,
    backgroundColor: "#FFF3E0",
    borderColor: "#FFF3E0",
    fontFamily: "Helvetica",
    paddingLeft: 15
  },
  infoDetail: {
    fontSize: 12,
    fontFamily: "Helvetica"
  },
  content: {
    color: "#4A4A4A",
    fontFamily: "Helvetica",
    fontSize: 16,
    marginLeft: 95
  },
  bold: {
    fontWeight: "bold"
  },
  dialog: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center"
  },
  grid: {
    paddingTop: 20,
    paddingRight: 70,
    paddingLeft: 70
  },
  dismiss: {
    left: 270,
    fontSize: 10,
    color: "#CCB693",
    "&:hover": {
      backgroundColor: "#FFF3E0",
      color: "#4a4a4a"
    }
  },
  pastActivity: {
    margin: 0
  }
};

class ClaimDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showNotif: true,
      newClaim: {},
      pastActivity: []
    };
    this.dismissNotifictaion = this.dismissNotifictaion.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.handleSubmission = this.handleSubmission.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const pastActivity = [];
    nextProps.currentClaimData.forEach(function(e) {
      if (e.val1 !== null || e.val2 !== null) {
        pastActivity.push(e);
      }
    });
    this.setState({
      newClaim: nextProps.currentClaimData[0],
      pastActivity
    });
  }

  dismissNotifictaion() {
    this.setState({
      showNotif: false
    });
  }
  onModalOpen() {
    const { claim } = this.props;
    this.props.getClaimData(claim.clm_num);
  }

  getNotifPanel() {
    const { classes } = this.props;
    if (this.state.showNotif) {
      return (
        <ExpansionPanel className={classes.panel}>
          <ExpansionPanelSummary className={classes.info}>
            <Typography className={classes.info}>
              How are intervention suggestions made?
            </Typography>
            <Button
              size="small"
              onClick={this.dismissNotifictaion}
              className={classes.dismiss}>
              Dismiss
            </Button>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className={classes.infoDetail}>
              All interventions are suggested based on more than 500 data points
              across hundreds of cases that you and your peers have managed.
              That’s a lot of hard work put to good use!
              <br />
              <br />
              Your answers here will help us give more accurate and relevant
              intervention suggestions in the future in order to assist you in
              those occasional tricky cases.
              <br />
              <br />
              As the expert, ultimately, it’s your call!
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    } else {
      return <div />;
    }
  }

  handleSubmission(submitData) {
    const { newClaim, pastActivity } = this.state;
    const data = {
      ...newClaim,
      pred1: submitData.pred1.pred,
      val1: submitData.pred1.val,
      feedback1: submitData.pred1.feedback,
      pred2: submitData.pred2.pred,
      val2: submitData.pred2.val,
      feedback2: submitData.pred2.feedback
    };
    const newArr = pastActivity.slice(0);
    newArr.splice(0, 0, data);
    this.setState({
      pastActivity: newArr
    });
  }

  unreviewedClaimsContent() {
    const { classes, loadingDialog } = this.props;
    const { newClaim } = this.state;
    if (loadingDialog) {
      return (
        <div style={{ justifyContent: "center", display: "flex" }} key={0}>
          <CircularProgress
            className={classes.progress}
            size={60}
            color="secondary"
          />
        </div>
      );
    } else if (newClaim.val1 === null || newClaim.val2 === null) {
      return (
        <div key={newClaim.id} className={classes.dialog}>
          <ClaimContent
            claim={newClaim}
            handleSubmission={this.handleSubmission}
          />
          <br />
        </div>
      );
    } else {
      return (
        <div className={classes.dialog}>
          <BlankCard />
        </div>
      );
    }
  }

  newSuggestionPrompt() {
    const { classes, currentClaimData } = this.props;
    if (this.state.pastActivity.length !== currentClaimData.length) {
      return (
        <div>
          <Typography className={classes.content}>
            There are new intervention suggestions for this case!
          </Typography>
          <br />
          <Typography className={classNames(classes.content, classes.bold)}>
            Please let us know whether you agree with them or not.
          </Typography>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    const { classes, claim } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          className={classes.dialog}
          maxWidth="md"
          onClose={this.props.modalHandler}
          onEnter={this.onModalOpen}>
          <div className={classes.head}>
            <span className={classes.claimText}>
              Claim Number {claim.clm_num}, Case Manager: {claim.cm_name}
            </span>
            <br />
            <span className={classes.category}>{claim.prim_diag_cat}</span>
            <span className={classes.weeks}>
              {Math.floor(claim.wsbsd)} WEEKS SINCE BENEFIT START
            </span>
          </div>

          <DialogContent>
            <div className={classes.dialog}>{this.getNotifPanel()}</div>
            <br />
            {this.newSuggestionPrompt()}
            <br />
            {this.unreviewedClaimsContent()}
          </DialogContent>
          <DialogActions className={classes.pastActivity}>
            <PastActivity pastFeedback={this.state.pastActivity} />
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    claimsData: state.data.claims,
    currentClaimData: state.data.currentClaimData,
    loadingDialog: state.data.loadingDialog
  };
};

ClaimDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  currentClaimData: PropTypes.array.isRequired,
  getClaimData: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { getClaimData }
)(withRoot(withStyles(styles)(ClaimDialog)));
