import React, { Component } from 'react';
import { connect } from 'react-redux';

class LeaderboardInfo extends Component {
  render() {
    return (
      <div>
        <h2 style={{ marginBottom: '0.25em' }}>{this.props.tournament.name}</h2>

        <p style={{ marginTop: '0', marginBottom: '0.25em' }}>
          <span className="color-label">Status:</span>{' '}
          {this.props.tournament.roundState}
        </p>
        <p style={{ marginTop: '0' }}>
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeaderboardInfo);
