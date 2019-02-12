import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

import TeamsTable from './allTeamsTable';
import LeaderboardInfo from './leaderboardInfo';

class LandingPage extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <h1>Leaderboard</h1>

        {!this.props.teamsLoaded ? (
          <p>Loading...</p>
        ) : (
          <div>
            <LeaderboardInfo />
            <TeamsTable />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tournament: state.pga.tournament,
    teams: state.pga.teams,
    teamsLoaded: state.pga.teamsLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);
