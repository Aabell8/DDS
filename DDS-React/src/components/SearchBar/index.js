import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import withRoot from "../../helpers/withRoot";
import Downshift from "downshift";
import Paper from "@material-ui/core/Paper";

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  filter: {
    flexGrow: 1,
    backgroundColor: "#BFBFBF",
    borderRadius: "4px 0 0 4px",
    height: 40,
    paddingLeft: 10,
    display: "flex",
    justifyContent: "center",
    color: "#4A4A4A",
    boxShadow: "inset 0 1px 3px 0 rgba(0,0,0,0.3)",
    opacity: 0.8
  },
  searchBar: {
    flexGrow: 1,
    backgroundColor: "#DFDFDF",
    boxShadow: "inset 0 1px 3px 0 rgba(0,0,0,0.3)",
    borderRadius: "0px 4px 4px 0px",
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
    justifyContent: "center",
    minWidth: 250,
    opacity: 0.8
  },
  paper: {
    position: "absolute",
    zIndex: 100,
    marginTop: 10,
    left: 50,
    right: 0,
    top: 50
  }
};

const filter = [
  {
    value: "case_manager_id",
    label: "Case Manager"
  },
  {
    value: "claim_num",
    label: "Claim ID"
  }
];

let suggestions = [];

const renderSuggestion = function({ suggestion, itemProps }) {
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      component="div"
      style={{
        fontWeight: 400
      }}>
      {suggestion.label}
    </MenuItem>
  );
};
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired
};

const getSuggestions = function(inputValue) {
  let count = 0;
  return suggestions.filter((suggestion) => {
    const keep =
      (!inputValue ||
        suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !==
          -1) &&
      count < 7;

    if (keep) {
      count += 1;
    }
    return keep;
  });
};

class SearchBar extends React.Component {
  componentWillReceiveProps(nextProps) {
    suggestions = [];
    nextProps.caseManagers.forEach((caseManager) => {
      suggestions.push({ label: caseManager.trim() });
    });
  }

  paperSuggestionComponent(isOpen, getItemProps, inputValue) {
    const { searchFilter, classes } = this.props;
    if (searchFilter === "case_manager_id" && isOpen) {
      return (
        <Paper className={classes.paper} square>
          {getSuggestions(inputValue).map((suggestion, index) => {
            return renderSuggestion({
              suggestion,
              index,
              itemProps: getItemProps({ item: suggestion.label })
            });
          })}
        </Paper>
      );
    } else {
      return null;
    }
  }

  /**
   * This function overrides the onChange function for selecting items in
   * Downshift to allow for manual handling
   * @param {String} selection - Selected item in list
   */
  handleChangedItem(selection) {
    // Get just name (take out ID)
    const lastIndex = selection.trim().lastIndexOf(" ");
    this.props.handleChange(
      "searchItem",
      selection.substring(0, lastIndex).trim()
    );
  }

  render() {
    const { classes, searchFilter, handleChange, searchItem } = this.props;
    return (
      <div className={classes.container}>
        <TextField
          InputProps={{
            disableUnderline: true
          }}
          select
          className={classes.filter}
          value={searchFilter}
          onChange={handleChange("searchFilter")}
          SelectProps={{
            MenuProps: {
              className: classes.menu
            }
          }}
          margin="normal">
          {filter.map((option) => {
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
        <Downshift
          onChange={(selection) => {
            return this.handleChangedItem(selection);
          }}
          selectedItem={searchItem}>
          {({ getInputProps, getItemProps, isOpen, inputValue }) => {
            return (
              <div className={classes.container}>
                <TextField
                  InputProps={getInputProps({
                    placeholder: "Search",
                    id: "integration-downshift-simple",
                    disableUnderline: true,
                    onChange: handleChange("searchItem"),
                    value: searchItem
                  })}
                  className={classes.searchBar}
                  margin="normal"
                />
                {this.paperSuggestionComponent(
                  isOpen,
                  getItemProps,
                  inputValue
                )}
              </div>
            );
          }}
        </Downshift>
      </div>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(SearchBar));
