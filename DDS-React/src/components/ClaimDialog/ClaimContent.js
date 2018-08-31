import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import withRoot from "../../helpers/withRoot";
import RecommendationCard from "../RecommendationCard";
import { STATUS_COMPLETED, STATUS_HIGHLIGHTED } from "../../helpers/constants";
import FeedBackForm from "../FeedBackForm";
import { postUserResponse } from "../../actions/claimsActions";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import ReactDOM from "react-dom";

const styles = {
  cardDiv: {
    width: 620,
    border: "1px solid #D8D8D8",
    marginTop: 35
  },
  grid: {
    paddingTop: 20,
    paddingRight: 70,
    paddingLeft: 70
  },
  date: {
    height: 36,
    width: 140,
    border: "1px solid #E7E7E7",
    backgroundColor: "#F9F9F9",
    boxShadow: "0 - 1px 0 0 rgba(0, 0, 0, 0.12)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#4A4A4A",
    fontFamily: "Helvetica",
    fontSize: 12,
    marginTop: -35,
    float: "right"
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

class ClaimContent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pred1Val: { status: STATUS_HIGHLIGHTED, answer: "", feedback: "" },
      pred2Val: { status: "", answer: "", feedback: "" },
      feedback1Open: false,
      feedback2Open: false,
      submitted: false,
      open: true
    };
    this.predClick = this.predClick.bind(this);
    this.saveFeedback = this.saveFeedback.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.scrollBack = this.scrollBack.bind(this);
  }

  handleFirstClick(value, pred2Val) {
    if (value === "yes") {
      let secondStatus = STATUS_HIGHLIGHTED;
      if (pred2Val.status === STATUS_COMPLETED) {
        secondStatus = STATUS_COMPLETED;
      }
      this.setState({
        pred1Val: {
          status: STATUS_COMPLETED,
          answer: "yes",
          feedback: ""
        },
        pred2Val: {
          ...pred2Val,
          status: secondStatus
        },
        feedback1Open: false
      });
      this.scrollBack();
    } else {
      let secondStatus = pred2Val.status;
      if (secondStatus === STATUS_HIGHLIGHTED) {
        secondStatus = "";
      }
      this.setState({
        pred1Val: {
          status: STATUS_HIGHLIGHTED,
          answer: "no",
          feedback: ""
        },
        pred2Val: {
          ...this.state.pred2Val,
          status: secondStatus
        },
        feedback1Open: true,
        feedback2Open: false
      });

      ReactDOM.findDOMNode(this.refs.submit).scrollIntoView({
        behavior: "smooth"
      });
    }
  }

  handleSecondClick(value) {
    if (value === "yes") {
      // Clicked yes on prediction 2
      this.setState({
        pred2Val: {
          status: STATUS_COMPLETED,
          answer: "yes",
          feedback: ""
        },
        feedback2Open: false
      });
      this.scrollBack();
    } else {
      // Clicked no on prediction 2
      this.setState({
        pred2Val: {
          status: STATUS_HIGHLIGHTED,
          answer: "no",
          feedback: ""
        },
        feedback2Open: true
      });
    }
    ReactDOM.findDOMNode(this.refs.submit).scrollIntoView({
      behavior: "smooth"
    });
  }

  predClick(predNum, value) {
    const { pred1Val, pred2Val, submitted } = this.state;
    if (submitted) {
      return false;
    }
    if (predNum === 1) {
      // Clicked on prediction 1
      this.handleFirstClick(value, pred2Val);
    } else {
      if (pred2Val.status === "" || pred1Val.status === STATUS_HIGHLIGHTED) {
        // Clicked second button when first is highlighted
        return false;
      }
      this.handleSecondClick(value);
    }
    return true;
  }

  saveFeedback(predNum, feedback, comment) {
    const { pred2Val } = this.state;

    if (predNum === 1) {
      // Prediction one feedback submit
      let secondStatus = STATUS_HIGHLIGHTED;
      if (pred2Val.status === STATUS_COMPLETED) {
        secondStatus = STATUS_COMPLETED;
      }
      const showSecond =
        pred2Val.answer === "no" && pred2Val.status !== STATUS_COMPLETED;

      this.setState({
        pred1Val: {
          status: STATUS_COMPLETED,
          answer: "no",
          feedback,
          comment
        },
        pred2Val: {
          ...pred2Val,
          status: secondStatus
        },
        feedback1Open: false,
        feedback2Open: showSecond
      });
    } else {
      // Prediction two feedback submit
      this.setState({
        pred2Val: {
          status: STATUS_COMPLETED,
          answer: "no",
          feedback,
          comment
        },
        feedback2Open: false
      });
    }
    this.scrollBack();
  }

  submitForm() {
    const { claim, handleSubmission } = this.props;
    const { pred1Val, pred2Val } = this.state;
    const submitData = {
      id: claim.id,
      pred1: {
        pred: claim.top_ip,
        val: pred1Val.answer,
        feedback: pred1Val.feedback
      },
      pred2: {
        pred: claim.second_ip,
        val: pred2Val.answer,
        feedback: pred2Val.feedback
      }
    };
    this.props.postUserResponse(submitData);
    this.setState({
      submitted: true
    });
    // Set timeout to close here
    handleSubmission(submitData);
  }

  scrollBack() {
    ReactDOM.findDOMNode(this.refs.claimContent).scrollIntoView({
      behavior: "smooth"
    });
  }

  componentWillReceiveProps() {
    this.setState({
      pred1Val: {
        status: STATUS_HIGHLIGHTED,
        answer: "",
        feedback: ""
      },
      pred2Val: { status: "", answer: "", feedback: "" },
      feedback1Open: false,
      feedback2Open: false,
      submitted: false
    });
  }

  submitButton() {
    const { claimsData } = this.props;
    const { pred1Val, pred2Val } = this.state;

    if (this.state.submitted) {
      return (
        <Typography variant="body2" className="predictionText">
          Thank you for your feedback!
        </Typography>
      );
    } else {
      const disableSubmit =
        (pred1Val.status !== STATUS_COMPLETED ||
          pred2Val.status !== STATUS_COMPLETED) &&
        !claimsData.submittingResponse;

      return (
        <Button
          variant="contained"
          disabled={disableSubmit}
          color="secondary"
          style={{
            width: "420px",
            height: "52px",
            marginBottom: "20px"
          }}
          onClick={this.submitForm}
          ref="submit">
          Submit
        </Button>
      );
    }
  }

  render() {
    const { classes, claim } = this.props;
    const { pred1Val, pred2Val } = this.state;

    let date = "";
    if (claim.predicted_on) {
      date = claim.predicted_on.split("-");
    }

    let pred1,
      pred2 = {
        image: "",
        prediction: "",
        confidence: 0
      };
    if (claim.top_ip) {
      pred1 = {
        ...pred1,
        prediction: claim.top_ip,
        confidence: claim.top_ip_prob
      };
      pred2 = {
        ...pred2,
        prediction: claim.second_ip,
        confidence: claim.second_ip_prob
      };
    }

    return (
      <Collapse in={true}>
        <div ref="claimContent">
          <div className={classes.date}>
            {months[date[1] - 1]} {date[2]}, {date[0]}
          </div>
          <div className={classes.cardDiv}>
            <Grid container align="center" className={classes.grid}>
              <Grid item xs={6}>
                <Typography align="center" variant="caption">
                  SUGGESTION 1
                </Typography>
                <RecommendationCard
                  num={1}
                  prediction={pred1}
                  value={pred1Val}
                  onButtonClick={this.predClick}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography align="center" variant="caption">
                  SUGGESTION 2
                </Typography>
                <RecommendationCard
                  num={2}
                  prediction={pred2}
                  value={pred2Val}
                  onButtonClick={this.predClick}
                />
              </Grid>
            </Grid>
            <Grid container className={classes.grid}>
              <Grid item xs={12}>
                <FeedBackForm
                  num={1}
                  open={this.state.feedback1Open}
                  onOKClick={this.saveFeedback}
                  onScrollBack={this.scrollBack}
                />
                <FeedBackForm
                  num={2}
                  open={this.state.feedback2Open}
                  onOKClick={this.saveFeedback}
                  onScrollBack={this.scrollBack}
                />
              </Grid>
            </Grid>

            <Grid container align="center" className={classes.grid}>
              <Grid item xs={12}>
                {this.submitButton()}
                <br />
              </Grid>
            </Grid>
          </div>
        </div>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    claimsData: state.data.claims
  };
};

ClaimContent.propTypes = {
  postUserResponse: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  { postUserResponse }
)(withRoot(withStyles(styles)(ClaimContent)));
