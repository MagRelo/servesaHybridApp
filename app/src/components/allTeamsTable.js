import React, { Component } from 'react';
import { connect } from 'react-redux';

import TeamTable from './singleTeamTable';

class LandingPage extends Component {
  state = { name: '' };

  componentDidMount() {
    // console.log(this.props.match.params.teamName);
  }

  generatePlayerRows(playerData) {
    let teamPlayers = [];

    playerData.forEach((player, index) => {
      if (player) {
        teamPlayers.push(player);
      }
    });

    teamPlayers.sort((a, b) => {
      return (
        b.rankings.projected_money_event - a.rankings.projected_money_event
      );
    });

    return teamPlayers.map((player, index) => {
      return (
        <tr key={index}>
          <td>
            {player.player_bio.last_name + ', ' + player.player_bio.first_name}
          </td>
          <td>{player.current_position}</td>
          <td>{player.today}</td>
          <td>{player.total}</td>
          <td>${player.rankings.projected_money_event.toLocaleString()}</td>
        </tr>
      );
    });
  }

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
                <h3>{team.label}</h3>

                <TeamTable playerData={team.playerData} />
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
