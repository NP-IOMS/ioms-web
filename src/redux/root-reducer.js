import { combineReducers } from "redux";

import allTeamsReducer from "./all-teams/all-teams-reducer";

export default combineReducers({
  allTeams: allTeamsReducer
});
