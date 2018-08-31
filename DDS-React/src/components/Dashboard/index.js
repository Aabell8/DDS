import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Grid, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../helpers/withRoot";
import TitleBar from "../TitleBar";
import Card from "../Card";
import InfiniteScroll from "react-infinite-scroller";
import ClaimDialog from "../ClaimDialog";
import {
  getClaims,
  changeSortDirection,
  resetDialogData
} from "../../actions/claimsActions";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

const CLAIM_INCREMENT = 32;

const styles = (theme) => {
  return {
    root: {
      flexGrow: 1
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: "center"
    },
    grid: {
      maxWidth: 1024,
      padding: theme.spacing.unit * 2
    },
    button: {
      zIndex: 10000,
      position: "fixed",
      color: "#4D4D4D",
      backgroundColor: "white",
      top: 10,
      marginLeft: 475
    }
  };
};

const onlyUnique = function(value, index, self) {
  return self.indexOf(value) === index;
};

let allClaims = [];

class Dashboard extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      claims: [],
      numClaims: CLAIM_INCREMENT,
      unreviewedCount: 0,
      showAll: true,
      openModal: false,
      modalClaim: {},
      searchFilter: "case_manager_id",
      searchItem: "",
      uniqueCaseManagers: [],
      lastUpdateDate: ""
    };

    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const caseManagerArray = [];
    let lastDate = "";
    if (nextProps.claims.length > 0) {
      allClaims = nextProps.claims;
      if (nextProps.claimsReversed === "desc") {
        lastDate = allClaims[0].predicted_on;
      } else {
        lastDate = allClaims[allClaims.length - 1].predicted_on;
      }
      let caseManager = "";
      allClaims.forEach((element) => {
        caseManager = `${element.cm_name.trim()} (${element.cm_id.trim()})`;
        caseManagerArray.push(caseManager);
      });

      const uniqueArray = caseManagerArray.filter(onlyUnique);
      uniqueArray.sort();
      this.setState({
        claims: allClaims.slice(0, this.state.numClaims),
        isLoading: false,
        unreviewedCount: nextProps.unreviewedCount,
        uniqueCaseManagers: uniqueArray,
        lastUpdateDate: lastDate
      });
    }
  }

  componentWillMount() {
    this.props.getClaims();
  }

  loadItems() {
    this.setState({
      claims: allClaims.slice(0, this.state.numClaims + CLAIM_INCREMENT),
      numClaims: this.state.numClaims + CLAIM_INCREMENT
    });
  }

  getCloseButton() {
    const { classes } = this.props;
    if (this.state.openModal) {
      return (
        <Button
          variant="fab"
          color="inherit"
          aria-label="delete"
          className={classes.button}
          onClick={this.handleClose}>
          <Icon>close</Icon>
        </Button>
      );
    } else {
      return null;
    }
  }

  handleClose = () => {
    this.setState({ openModal: false });
    this.props.resetDialogData();
    this.props.getClaims();
  };

  handleCardClick(claim) {
    if (claim.id) {
      this.setState({
        openModal: !this.state.openModal,
        modalClaim: claim
      });
    } else {
      this.props.resetDialogData();
      this.props.getClaims();
      this.setState({
        openModal: !this.state.openModal,
        modalClaim: {}
      });
    }
  }

  handleAllClaimsClick() {
    this.props.getClaims();
    this.setState({
      showAll: true,
      hasMoreItems: true,
      numClaims: 0,
      claims: []
    });
  }

  handleNotReviewedClick() {
    this.setState({
      showAll: false,
      hasMoreItems: true,
      numClaims: 0,
      claims: []
    });
  }

  handleFilterChange(name, selection) {
    if (selection) {
      return this.setState({
        searchItem: selection,
        numClaims: CLAIM_INCREMENT,
        claims: allClaims.slice(0, CLAIM_INCREMENT)
      });
    } else {
      return (event) => {
        return this.setState({
          [name]: event.target.value,
          numClaims: CLAIM_INCREMENT,
          claims: allClaims.slice(0, CLAIM_INCREMENT)
        });
      };
    }
  }

  handleSortChange(event) {
    if (event.target.value === "asc") {
      this.props.changeSortDirection("asc");
    } else {
      this.props.changeSortDirection("desc");
    }
    return true;
  }

  claimNumFilter(clm_num, searchFilter) {
    const expr =
      searchFilter === "claim_num" &&
      clm_num &&
      ~clm_num.toString().indexOf(this.state.searchItem);
    return expr;
  }

  caseManagerFilter(cm_id, cm_name) {
    const expr =
      (cm_id &&
        ~cm_id
          .trim()
          .toLowerCase()
          .indexOf(this.state.searchItem.toLowerCase())) ||
      (cm_name &&
        ~cm_name
          .trim()
          .toLowerCase()
          .indexOf(this.state.searchItem.toLowerCase()));
    return expr;
  }

  mapClaim(claim, searchFilter) {
    const { searchItem } = this.state;
    if (
      searchItem === "" ||
      (this.claimNumFilter(claim.clm_num, searchFilter) ||
        (searchFilter === "case_manager_id" &&
          this.caseManagerFilter(claim.cm_id, claim.cm_name)))
    ) {
      return (
        <Grid key={claim.id} item xs={6} sm={4} md={3}>
          <div
            onClick={() => {
              return this.handleCardClick(claim);
            }}
            style={{ cursor: "pointer" }}>
            <Card claim={claim} />
          </div>
        </Grid>
      );
    } else {
      return null;
    }
  }

  claimsContent() {
    const { searchFilter, claims, showAll } = this.state;
    if (showAll) {
      return (
        <Grid item container justify="center" spacing={24}>
          {claims.map((claim) => {
            return this.mapClaim(claim, searchFilter);
          })}
        </Grid>
      );
    } else {
      return (
        <Grid item container justify="center" spacing={24}>
          {this.state.claims.map((claim) => {
            if (claim.isNew) {
              return this.mapClaim(claim, searchFilter);
            } else {
              return null;
            }
          })}
        </Grid>
      );
    }
  }

  scrollComponent() {
    const { classes } = this.props;
    const { numClaims } = this.state;

    let hasMoreFlag = true;
    if (numClaims >= allClaims.length) {
      hasMoreFlag = false;
    }
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems.bind(this)}
        hasMore={hasMoreFlag}
        threshold={200}
        loader={
          <div style={{ justifyContent: "center", display: "flex" }} key={0}>
            <CircularProgress
              className={classes.progress}
              size={60}
              color="secondary"
            />
          </div>
        }>
        <div
          style={{
            marginLeft: "24px",
            marginRight: "24px",
            display: "flex",
            width: "100%",
            margin: "auto",
            justifyContent: "center"
          }}>
          {this.getCloseButton()}
          <Grid
            container
            spacing={24}
            direction="column"
            className={classes.grid}>
            {this.claimsContent()}
          </Grid>

          <ClaimDialog
            open={this.state.openModal}
            modalHandler={this.handleCardClick}
            claim={this.state.modalClaim}
          />
        </div>
      </InfiniteScroll>
    );
  }

  render() {
    const { unreviewedCount, showAll, searchFilter, searchItem } = this.state;
    return (
      <div>
        <TitleBar
          handleAll={this.handleAllClaimsClick.bind(this)}
          handleNotReviewed={this.handleNotReviewedClick.bind(this)}
          unreviewedCount={unreviewedCount}
          showAll={showAll}
          searchFilter={searchFilter}
          searchItem={searchItem}
          dateFilter={this.props.claimsReversed}
          handleChange={this.handleFilterChange}
          handleSortChange={this.handleSortChange}
          allCount={this.props.claims.length}
          caseManagers={this.state.uniqueCaseManagers}
          lastUpdatedDate={this.state.lastUpdateDate}
        />
        {this.scrollComponent()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    claims: state.data.claims,
    unreviewedCount: state.data.unreviewedCount,
    moreClaims: state.data.moreClaims,
    claimsReversed: state.data.claimsReversed
  };
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  getClaims: PropTypes.func.isRequired,
  resetDialogData: PropTypes.func.isRequired,
  changeSortDirection: PropTypes.func.isRequired,
  claims: PropTypes.array.isRequired,
  moreClaims: PropTypes.bool.isRequired,
  claimsReversed: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  { getClaims, changeSortDirection, resetDialogData }
)(withRoot(withStyles(styles)(Dashboard)));
