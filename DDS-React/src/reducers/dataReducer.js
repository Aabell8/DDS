import {
  GET_ALL_CLAIMS,
  USER_FEEDBACK_SUBMIT,
  USER_FEEDBACK_RESPONSE,
  GET_CLAIM_DATA,
  CHANGE_SORT_DIRECTION,
  RESET_DIALOG_DATA
} from "../actions/types";

// Corresponds to firebase tables
const initialState = {
  claims: [],
  moreClaims: true,
  unreviewedCount: 0,
  loadingDialog: true,
  submittingResponse: false,
  currentClaimData: [],
  claimsReversed: "desc"
};

export default function(state = initialState, action = null) {
  switch (action.type) {
    case GET_ALL_CLAIMS:
      return {
        ...state,
        claims: action.payload.claims,
        unreviewedCount: action.payload.unreviewedCount,
        moreClaims: action.payload.hasMore,
        claimsReversed: "desc"
      };
    case USER_FEEDBACK_SUBMIT:
      return {
        ...state,
        submittingResponse: true
      };
    case USER_FEEDBACK_RESPONSE:
      return {
        ...state,
        submittingResponse: false
      };
    case GET_CLAIM_DATA:
      return {
        ...state,
        currentClaimData: action.claims,
        loadingDialog: false
      };
    case CHANGE_SORT_DIRECTION:
      if (action.reversed === state.claimsReversed) {
        return state;
      } else {
        state.claims.reverse();
        return {
          ...state,
          claimsReversed: action.reversed
        };
      }
    case RESET_DIALOG_DATA:
      return {
        ...state,
        currentClaimData: [],
        loadingDialog: true
      };
    default:
      return state;
  }
}
