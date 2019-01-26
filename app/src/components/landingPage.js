import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';
import AutoForm from 'components/autoForm';

class LandingPage extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <h1>Servesa Truffle Box</h1>
        <p>Hybrid web-app setup</p>
        <h2>Contracts</h2>
        <ul>
          <li>
            <a href="https://github.com/austintgriffith/bouncer-proxy/blob/master/README.md">
              BouncerProxy
            </a>
            : submit transactions on behalf of your users.
          </li>
          <li>SimpleStorage: simple storage contract to test BouncerProxy</li>
        </ul>
        <h2>Server features </h2>
        <ul>
          <li>HTTP & WebSocket API</li>
          <li>Authentication middleware using digital signatures</li>
          <li>Listen for contract events</li>
          <li>Submit transactions from server</li>
        </ul>
        <h2>Client features </h2>
        <div>
          <div>
            <h3>Redux stores</h3>
            <p>Load web3, contracts and accounts </p>

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

          <div>
            <h3>Loader component</h3>
            <p>Wait for web3, contracts and accounts </p>

            <div>
              <div>
                <p>Require web3 and contracts:</p>
                <pre>{`<Loader skipAccounts={true}>
  <p style={{ textAlign: 'center' }}>(Wrapped content...)</p>
</Loader>`}</pre>

                <Loader skipAccounts={true}>
                  <p style={{ textAlign: 'center' }}>(Wrapped content...)</p>
                </Loader>
              </div>
              <div>
                <p>Require web3, contracts, and account: </p>

                <pre>{`<Loader>
  <p style={{ textAlign: 'center' }}>(Wrapped content...)</p>
</Loader>`}</pre>
                <Loader>
                  <p style={{ textAlign: 'center' }}>(Wrapped content...)</p>
                </Loader>
              </div>
            </div>
          </div>

          <div>
            <h3>AutoForm component</h3>
            <p>Auto-generate forms for contract functions</p>

            <div>
              <div>
                <pre>
                  {'<AutoForm contract="simpleStorage" method="set" />'}
                </pre>
                <Loader>
                  <AutoForm contract="simpleStorage" method="saveSender" />
                </Loader>
              </div>
              <div>
                <pre>
                  {'<AutoForm contract="bouncerProxy" method="forward" />'}
                </pre>
                <Loader>
                  <AutoForm contract="bouncerProxy" method="forward" />
                </Loader>
              </div>
            </div>
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
