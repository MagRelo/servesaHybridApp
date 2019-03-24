import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadLeaderboard } from 'state/loadPGA';

class LeaderboardInfo extends Component {
  render() {
    return (
      <div>
        <h1 style={{ marginBottom: '0.25em' }}>{this.props.tournament.name}</h1>

        <p style={{ marginTop: '0', marginBottom: '0.25em' }}>
          <span className="color-label">Status:</span>{' '}
          {this.props.tournament.roundState}
        </p>
        <p style={{ marginTop: '0', marginBottom: '0.25em' }}>
          <span className="color-label">Last Updated: </span>
          {this.props.tournament.lastUpdated}
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tournament: state.pga.tournament
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLeaderboard: () => {
      return loadLeaderboard();
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaderboardInfo);
