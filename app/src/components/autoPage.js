import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';
import AutoForm from 'components/autoForm';

class LandingPage extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <h1>AutoForm</h1>
        <Loader>
          <AutoForm contract="bouncerProxy" method="getHash" />
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
      selectedAccount: state.account.selectedAccount,
      balance: state.account.balance,
      accounts: state.account.accounts
    },

    contracts: {
      contractsReady: state.contracts.contractsReady,
      simpleStorage: typeof state.contracts.simpleStorage,
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
)(LandingPage);
