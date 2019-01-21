import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'loader';

import './App.css';

class App extends Component {
  state = { accounts: null };

  componentDidMount = async () => {};

  render() {
    return (
      <div className="App">
        <h1>web3 App</h1>

        <h2>Client</h2>
        <p>Component State</p>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <p>Web3 Reducer</p>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>

        <Loader>
          <p>Loaded!</p>
        </Loader>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3Ready: state.web3.web3Ready,
    accountsReady: state.web3.accountsReady,

    contractsReady: state.web3.contractsReady,
    networkReady: state.web3.networkReady,

    showTip: state.web3.showTip,

    network: state.web3.network,
    accounts: state.web3.accounts,
    balance: state.web3.balance
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
