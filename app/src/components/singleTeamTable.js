import React, { Component } from 'react';

class TeamTable extends Component {
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
          <td>{player.current_position || player.status}</td>
          <td>{player.today}</td>
          <td className="hide-mobile">{player.thru}</td>
          <td className="hide-mobile">{player.total}</td>
          <td className="hide-mobile">
            ${player.rankings.projected_money_event.toLocaleString()}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="pure-table" style={{ marginBottom: '3em' }}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Position</th>
            <th>Today</th>
            <th className="hide-mobile">Thru</th>
            <th className="hide-mobile">Total</th>
            <th className="hide-mobile">Projected</th>
          </tr>
        </thead>
        <tbody>{this.generatePlayerRows(this.props.playerData)}</tbody>
      </table>
    );
  }
}

export default TeamTable;
