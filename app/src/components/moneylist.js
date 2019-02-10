import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class LandingPage extends Component {
  state = { name: '' };

  componentDidMount() {
    // console.log(this.props.match.params.teamName);

    const slug = this.props.match.url;

    // find player in money list
    const team = this.props.teams.find(team => {
      return team.slug === slug;
    });

    if (team) {
      this.setState({
        name: team.label,
        slug: team.slug
      });
    } else {
      console.log('not found');
    }

    // load team
  }

  generatePlayerRows() {
    const team = this.props.teams.find(team => {
      return team.slug === this.state.slug;
    });

    if (team) {
      return team.playerData.map((player, index) => {
        if (player) {
          return (
            <tr key={index}>
              <td>
                {player.player_bio.last_name +
                  ', ' +
                  player.player_bio.first_name}
              </td>
              <td>{player.current_position}</td>
              <td>{player.today}</td>
              <td>{player.total}</td>
            </tr>
          );
        }

        return (
          <tr key={index}>
            <td>{'(not playing)'}</td>
            <td />
            <td />
          </tr>
        );
      });
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.name}</h1>

        {!this.props.teamsLoaded ? (
          <p>Loading....</p>
        ) : (
          <div>
            <h2>This Week</h2>
            <p>comins goon</p>
            <h2>YTD Earnings</h2>
            <p>Team Total: {}</p>
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Today</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>{this.generatePlayerRows()}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    teams: state.team.teams,
    teamsLoaded: state.team.teamsLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);
