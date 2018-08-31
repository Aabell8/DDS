import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../../helpers/withRoot";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import SearchBar from "../SearchBar";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import logo from "../../assets/Manulife_White_Cube.png";

const styles = {
  root: {
    flexGrow: 1
  },
  utility: {
    width: "100%",
    height: 65,
    backgroundColor: "#FAFAFA",
    marginTop: 70,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start"
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    padding: 0,
    flexGrow: 4,
    justifyContent: "flex-start"
  },
  center: {
    justifyContent: "center"
  },
  title: {
    height: 120
  },
  button: {
    minWidth: 20,
    textTransform: "none",
    marginLeft: 10,
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
    minHeight: 15,
    border: "1px solid #979797",
    borderRadius: 10
  },
  selectedButton: {
    border: "1px solid #4A90E2",
    backgroundColor: "#4A90E2",
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    height: 60,
    alignSelf: "flex-start",
    padding: 0,
    flexGrow: 2,
    position: "relative",
    top: -4
  },
  notReviewed: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    height: 24,
    width: 24,
    marginLeft: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  status: {
    whiteSpace: "nowrap"
  },
  dateFilter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexGrow: 4,
    position: "relative",
    top: -4,
    opacity: 0.8
  },
  titleBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 2.5,
    position: "relative"
  },
  logo: {
    height: 40,
    width: 40,
    marginRight: 10
  },
  titleDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
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

const dateFilter = [
  {
    value: "desc",
    label: "Sort : Latest to Oldest"
  },
  {
    value: "asc",
    label: "Sort : Oldest To Latest"
  }
];
let date = [];
class TitleBar extends Component {
  getDate(lastUpdatedDate) {
    if (lastUpdatedDate) {
      date = lastUpdatedDate.split("-");
      return months[date[1] - 1] + " " + date[2] + ", " + date[0];
    } else {
      return "";
    }
  }
  render() {
    const {
      classes,
      handleNotReviewed,
      handleAll,
      unreviewedCount,
      showAll,
      searchFilter,
      searchItem,
      allCount,
      lastUpdatedDate
    } = this.props;

    let allStyle,
      unrevStyle = null;
    if (showAll === true) {
      allStyle = classes.selectedButton;
    } else {
      unrevStyle = classes.selectedButton;
    }

    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="primary" className={classes.title}>
          <Toolbar>
            <div className={classes.titleBar}>
              <div className={classes.titleDiv}>
                <img src={logo} className={classes.logo} alt="" />
                <Typography variant="title" color="inherit">
                  Intervention Recommendations
                </Typography>
              </div>
              <Typography color="inherit" className={classes.lastUpdate}>
                Last Updated : {this.getDate(lastUpdatedDate)}
              </Typography>
            </div>
            <AppBar className={classes.utility}>
              <Toolbar className={classes.root}>
                <div className={classes.searchContainer}>
                  <SearchBar
                    searchFilter={searchFilter}
                    searchItem={searchItem}
                    handleChange={this.props.handleChange}
                    caseManagers={this.props.caseManagers}
                  />
                </div>
                <div className={classNames(classes.grid, classes.center)}>
                  <Typography>SHOW</Typography>
                  <Button
                    className={classNames(classes.button, allStyle)}
                    size="small"
                    onClick={handleAll}>
                    All ({allCount})
                  </Button>
                  <Button
                    className={classNames(classes.button, unrevStyle)}
                    size="small"
                    onClick={handleNotReviewed}>
                    New ({unreviewedCount})
                  </Button>
                </div>
                <div className={classes.dateFilter}>
                  <TextField
                    InputProps={{
                      disableUnderline: true
                    }}
                    select
                    value={this.props.dateFilter}
                    onChange={this.props.handleSortChange}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu
                      }
                    }}
                    margin="normal"
                    placeholder="Sort By Date">
                    {dateFilter.map((option) => {
                      return (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          className={classes.menu}>
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </div>
              </Toolbar>
            </AppBar>
          </Toolbar>
        </AppBar>
        <div style={{ paddingTop: 200 }} />
      </div>
    );
  }
}

TitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAll: PropTypes.func.isRequired,
  handleNotReviewed: PropTypes.func.isRequired
};

export default withRoot(withStyles(styles)(TitleBar));
