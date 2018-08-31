import {
  GET_ALL_CLAIMS,
  USER_FEEDBACK_SUBMIT,
  USER_FEEDBACK_RESPONSE,
  GET_CLAIM_DATA,
  CHANGE_SORT_DIRECTION,
  RESET_DIALOG_DATA
} from "./types";
import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_HOST || `http://${window.location.hostname}:5000`;
const instance = axios.create({ baseURL });
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

/**
 * Action gets all claims from database based on parameters
 */
export function getClaims(searchBy, searchText, sortReverse) {
  return function(dispatch) {
    return instance
      .get("/api/claims", {
        params: { searchBy, searchText, sortReverse }
      })
      .then(
        function(res) {
          const payload = res.data;
          dispatch({
            type: GET_ALL_CLAIMS,
            payload
          });
        },
        function() {
          const payload = { claims: [], hasMore: false };
          dispatch({
            type: GET_ALL_CLAIMS,
            payload
          });
        }
      );
  };
}

/**
 * Action takes a claim number and retrieves all feedback for the claim
 * @param {Number} claimNum - claim number reference for query
 */
export function getClaimData(claimNum) {
  return function(dispatch) {
    return instance.get(`/api/claims/${claimNum}`).then(function(res) {
      const { claims } = res.data;
      dispatch({
        type: GET_CLAIM_DATA,
        claims
      });
    });
  };
}

/**
 * Action takes userREsponse add or updates the user's response in the  database
 * @param {Object} userResponse - object with details of claim and user's
 * response on suggestions
 */
export function postUserResponse(userResponse) {
  return function(dispatch) {
    dispatch({ type: USER_FEEDBACK_SUBMIT });
    return instance.put("/api/feedback", userResponse).then(function() {
      dispatch({ type: USER_FEEDBACK_RESPONSE });
    });
  };
}

/**
 * Sets the direction of sort on dashboard
 * @param {Boolean} reversed - Direction flag
 */
export function changeSortDirection(reversed) {
  return function(dispatch) {
    dispatch({ type: CHANGE_SORT_DIRECTION, reversed });
  };
}

/**
 * Clears current dialog data from redux store
 */
export function resetDialogData() {
  return function(dispatch) {
    dispatch({ type: RESET_DIALOG_DATA });
  };
}
