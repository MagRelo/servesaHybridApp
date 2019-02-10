import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

import TeamsTable from './allTeamsTable';

class LandingPage extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <h1>Fantasy Golf</h1>

        {!this.props.teamsLoaded ? (
          <p>Loading...</p>
        ) : (
          <div>
            <h2>{this.props.tournament.name}</h2>
            <p>{this.props.tournament.course}</p>
            <p>{this.props.tournament.tournamentDates}</p>
            <p>{this.props.tournament.roundState}</p>
            <p>Last updated: {this.props.tournament.lastUpdated}</p>
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
