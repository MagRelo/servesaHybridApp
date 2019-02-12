import React, { Component } from 'react';

class TeamTable extends Component {
  generatePlayerRows() {
    return this.props.playerData.map((player, index) => {
      return (
        <tr key={index}>
          <td>
            {player.player_bio.last_name + ', ' + player.player_bio.first_name}
          </td>
          <td>{player.current_position || player.status}</td>
          <td>{player.today}</td>
          <td> {player.thru}</td>
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
            <th>Thru</th>
            <th className="hide-mobile">Total</th>
            <th className="hide-mobile">Projected</th>
          </tr>
        </thead>
        <tbody>{this.generatePlayerRows()}</tbody>
      </table>
    );
  }
}

export default TeamTable;
