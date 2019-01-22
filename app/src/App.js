import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';
import AutoForm from 'components/auto-form';

// CSS
import './css/open-sans.css';
import './css/pure-min.css';
import './index.css';

const signatureAuthSample = `function signatureAuth(req, res, next) {
  // check for header
  if (!req.headers['x-servesa']) {
    return res.status(401).send([]);
  }

  // parse header object
  const authObject = JSON.parse(req.headers['x-servesa']);
  if (!authObject.message || !authObject.signature) {
    return res.status(401).send('Unauthorized');
  }

  // recover public key
  const userAddress = sigUtil.recoverPersonalSignature({
    data: authObject.message,
    sig: authObject.signature
  });

  // parse message
  const message = JSON.parse(
    ethUtil.toBuffer(authObject.message).toString('utf8')
  );

  // pass along userAddress and message
  req.userAddress = userAddress;
  req.userMessage = message;

  // call next middleware function
  next();
}
`;

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div className="App">
        <h1>Servesa Truffle Box</h1>

        <h2>Contracts</h2>

        <ul>
          <li>BouncerProxy: submit transactions on behalf of your users.</li>
          <li>SimpleStorage: simple storage contract to test BouncerProxy</li>
        </ul>

        <h2>Server features </h2>

        <ul>
          <li>HTTP & WebSocket API</li>
          <li>Authentication middleware using digital signatures</li>
          <li>Watch and save contract events</li>
          <li>Submit Eth transactions from server</li>
        </ul>

        <h2>Client features </h2>
        <div className="row row-3">
          <div>
            <h3>Redux stores</h3>
            <p>Load web3, contracts and accounts </p>
            <hr />

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
            <hr />

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
            <hr />
            <div>
              <div>
                <pre>
                  {'<AutoForm contract="simpleStorage" method="set" />'}
                </pre>
                <Loader>
                  <AutoForm contract="simpleStorage" method="set" />
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
)(App);
