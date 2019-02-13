import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import TeamTable from './leaderboardTeamTable';

class LandingPage extends Component {
  state = { name: '' };

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>

        <div>
          {this.props.teams.map(team => {
            return (
              <div key={team.label}>
                <span style={{ float: 'right', lineHeight: '1.7em' }}>
                  <span className="color-label">Projected:</span>{' '}
                  {`$${team.teamTotal.toLocaleString()}`}
                </span>

                <h3>
                  <Link to={team.slug}>{team.label}</Link>
                </h3>

                <TeamTable activePlayers={team.activePlayers} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
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
