import React, { Component } from 'react';
import { connect } from 'react-redux';

class LandingPage extends Component {
  state = {
    team: null,
    teamName: '',
    playerData: [],
    players: [],
    teamTotal: 0
  };

  componentDidMount() {
    this.updateTeam();
  }

  componentDidUpdate(prevProps) {
    if (this.props.teams !== prevProps.teams) {
      this.updateTeam();
    }
  }

  updateTeam() {
    const slug = this.props.match.url;
    const team = this.props.teams.find(team => {
      return team.slug === slug;
    });

    if (team) {
      this.setState({
        team: team,
        teamName: team.label,
        teamTotal: team.teamTotal,
        playerData: team.playerData,
        players: team.players
      });
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.teamName}</h1>

        {!this.props.teamsLoaded ? (
          <p>Loading....</p>
        ) : (
          <div>
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Player</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {this.state.players.map((player, index) => {
                  return (
                    <tr key={player.pid}>
                      <td>{index + 1}</td>
                      <td>{player.nameL + ', ' + player.nameF}</td>
                      <td className="color-label">
                        {player.active ? '✔' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
