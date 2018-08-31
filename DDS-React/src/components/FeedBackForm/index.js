import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import withRoot from "../../helpers/withRoot";

const styles = {
  formControl: {
    margin: 10
  },
  group: {
    margin: 10
  },
  ok: {
    height: 40,
    minWidth: 40,
    marginLeft: 2.5,
    marginRight: 2.5,
    left: -2.5,
    padding: 0,
    borderRadius: 4,
    backgroundColor: "#4A90E2",
    "&:hover": {
      backgroundColor: "#4A90E2"
    }
  },
  feedback: {
    "&:focus": {
      outline: "2px solid orange"
    }
  },
  root: {
    width: 420,
    marginLeft: 35
  },
  char: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  okGrid: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  }
};

class FeedBackForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      comment: "",
      charCount: 0
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
  }

  handleCommentChange = (event) => {
    if (event.target.value.length <= 250) {
      this.setState({
        comment: event.target.value,
        charCount: event.target.value.length
      });
    }
  };

  render() {
    const { classes, onOKClick, num, open } = this.props;
    const { comment } = this.state;
    return (
      <Collapse in={open}>
        <div className={classes.root}>
          <Typography variant="subheading">
            Sorry to hear. Could you tell us why you don’t agree with this
            recommendation? This will help us improve future recommendations.
          </Typography>

          <Grid container direction="row" spacing={24}>
            <Grid item xs>
              <br />
              <div className={classes.char}>
                <Zoom in={Boolean(comment)}>
                  <Typography variant="caption" gutterBottom align="center">
                    ({this.state.charCount}/250)
                  </Typography>
                </Zoom>
              </div>
              <TextField
                multiline
                rowsMax="9"
                value={comment}
                placeholder="Feedback"
                fullWidth
                inputProps={{
                  "aria-label": "Description"
                }}
                onChange={this.handleCommentChange}
                className={classes.feedback}
              />
            </Grid>
            <Grid item xs={2} className={classes.okGrid}>
              <br />
              <Zoom in={Boolean(comment)}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.ok}
                  onClick={() => {
                    return onOKClick(num, comment);
                  }}>
                  OK
                </Button>
              </Zoom>
            </Grid>
          </Grid>
        </div>
      </Collapse>
    );
  }
}
FeedBackForm.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withRoot(withStyles(styles)(FeedBackForm));
