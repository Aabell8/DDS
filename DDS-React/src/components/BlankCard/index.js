import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import withRoot from "../../helpers/withRoot";
import BlankCardImage from "../../assets/empty_state_card.png";

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
  image: {
    width: 200,
    height: 300
  },
  info: {
    opacity: 0.5,
    color: "#4D4D4D",
    fontFamily: "Helvetica",
    fontSize: 13,
    fontWeight: "bold"
  }
};

class BlankCard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.cardDiv}>
        <Grid container align="center" className={classes.grid}>
          <Grid item xs={6}>
            <Typography align="center" variant="caption">
              SUGGESTION 1
            </Typography>
            <img src={BlankCardImage} className={classes.image} alt="" />
          </Grid>
          <Grid item xs={6}>
            <Typography align="center" variant="caption">
              SUGGESTION 2
            </Typography>
            <img src={BlankCardImage} className={classes.image} alt="" />
          </Grid>
          <br />
          <Grid item xs={12}>
            <Typography align="center" className={classes.info}>
              Intervention recommendations will show up here when they’re
              available.
            </Typography>
            <br />
            <Typography align="center" className={classes.info}>
              There’s nothing to review now. Check back again later!
            </Typography>
            <br />
          </Grid>
        </Grid>
      </div>
    );
  }
}

BlankCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(BlankCard));
