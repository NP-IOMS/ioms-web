import _ from "lodash";
import { AllTeamsActionTypes } from "./all-teams-actionTypes";

export default function getAllTeams() {
  return (dispatch, getState) => {
    const state = getState();

    // There is cached data!
    if (!_.isEmpty(state.allTeams.allTeamsList)) {
      return;
    }

    const url = "/api/dictionary/distinctTeams";

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => {
        if (response.status >= 400) {
          throw new Error(`Bad response from server ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        const sortedList = json.sort((teamA, teamB) => {
          if (teamA.name.toLowerCase() < teamB.name.toLowerCase()) {
            return -1;
          }
          if (teamA.name.toLowerCase() > teamB.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        dispatch({
          type: AllTeamsActionTypes.GET_ALL_TEAMS_SUCCESS,
          payload: sortedList
        });
      })
      .catch(ex => {
        dispatch({
          type: AllTeamsActionTypes.GET_ALL_TEAMS_FAILURE
        });
        throw new Error(`Failed to fetch teams ${ex}`);
      });
  };
}
