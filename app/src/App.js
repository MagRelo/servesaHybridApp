import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';

// Fonts
import './css/averta.css';
import './css/open-sans.css';

// Pure css
import './css/pure-min.css';

// App css
import './index.css';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div className="App">
        <h1>web3 App</h1>

        <h2>Client</h2>

        <h3>Redux stores</h3>
        <p>state.web3</p>
        <pre>{JSON.stringify(this.props.web3, null, 2)}</pre>

        <p>state.contracts</p>
        <pre>{JSON.stringify(this.props.contracts, null, 2)}</pre>

        <p>state.account</p>
        <pre>{JSON.stringify(this.props.account, null, 2)}</pre>

        <h3>Loader States</h3>
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
      instance: typeof state.web3.instance,
      networkReady: state.web3.networkReady,
      network: state.web3.network,
      networkID: state.web3.networkID
    },

    account: {
      accountsReady: state.account.accountsReady,
      currentAccount: state.account.currentAccount,
      balance: state.account.balance,
      accounts: state.account.accounts
    },

    contracts: {
      contractsReady: state.contracts.contractsReady,
      bouncerProxy: typeof state.contracts.bouncerProxy
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
