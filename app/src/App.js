import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';

// CSS
import './css/open-sans.css';
import './index.css';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div className="App">
        <h1>Servesa Web3 App</h1>

        <h2>Redux stores</h2>

        <div className="row row-3">
          <div>
            <p>state.web3</p>
            <pre>{JSON.stringify(this.props.web3, null, 2)}</pre>
          </div>
          <div>
            <p>state.contracts</p>
            <pre>{JSON.stringify(this.props.contracts, null, 2)}</pre>
          </div>
          <div>
            {' '}
            <p>state.account</p>
            <pre>{JSON.stringify(this.props.account, null, 2)}</pre>
          </div>
        </div>

        <h2>Loader States</h2>

        <div className="row row-2">
          <div>
            <p>Require web3, contracts, and account </p>
            <Loader>
              <p>Content Loaded!</p>
            </Loader>
          </div>
          <div>
            <p>Require web3 & contracts</p>
            <Loader skipAccounts={true}>
              <p>Content Loaded!</p>
            </Loader>
          </div>
        </div>
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
