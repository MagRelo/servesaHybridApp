import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'loader';

// Fonts
import './css/averta.css';
import './css/open-sans.css';

// Pure css
import './css/pure-min.css';
import './App.css';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div className="App">
        <h1>web3 App</h1>

        <h2>Client</h2>

        <p>Web3 Reducer</p>
        <pre>{JSON.stringify(this.props.web3, null, 2)}</pre>

        <p>Account Reducer</p>
        <pre>{JSON.stringify(this.props.account, null, 2)}</pre>

        <p>Contracts Reducer</p>
        <pre>{JSON.stringify(this.props.contracts, null, 2)}</pre>

        <p>Loader</p>
        <Loader>
          <p>Loaded!</p>
        </Loader>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3: {
      web3Ready: state.web3.web3Ready,
      networkReady: state.web3.networkReady,
      network: state.web3.network,
      networkID: state.web3.networkID
    },
    account: {
      accounts: state.account.accounts,
      currentAccount: state.account.currentAccount,
      balance: state.account.balance,
      accountsReady: state.account.accountsReady
    },

    contracts: {
      contractsReady: state.contracts.contractsReady,
      bouncerLoaded: !!state.contracts.bouncer
    },

    showTip: state.web3.showTip
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
