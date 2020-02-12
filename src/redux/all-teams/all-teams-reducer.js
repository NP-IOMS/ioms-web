import { AllTeamsActionTypes } from "./all-teams-actionTypes";

const INITIAL_STATE = [];

const allTeamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AllTeamsActionTypes.GET_ALL_TEAMS_SUCCESS:
      return {
        ...state,
        allTeamsList: action.payload
      };

    default:
      return state;
  }
};

export default allTeamsReducer;
