import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

import TeamsTable from './allTeamsTable';

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
            <div>
              <h2 style={{ marginBottom: '0.25em' }}>
                {this.props.tournament.name}
              </h2>

              <p style={{ marginTop: '0', marginBottom: '0.25em' }}>
                <span className="color-label">Status:</span>{' '}
                {this.props.tournament.roundState}
              </p>
              <p style={{ marginTop: '0' }}>
                <span className="color-label">Last Updated: </span>
                {this.props.tournament.lastUpdated}
              </p>
            </div>
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
