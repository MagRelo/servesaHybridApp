import React, { Component } from 'react';
import { connect } from 'react-redux';

import WarningIcon from 'images/warning.svg';

class LoadWrapper extends Component {
  selectMessage() {
    const networkConnectionDocs = 'https://google.com';

    let message = '';

    if (!this.props.networkReady || !this.props.contractsReady) {
      message = `Please make sure you are connected to the right network.
      <br/><br/> See our <a href="${networkConnectionDocs}" target="_blank" rel="noopener noreferrer">documentation</a> for more information.`;
    }

    if (!this.props.accountsReady) {
      message = `Your web3 account is not available. You may need to unlock your account.  
      <br/><br/> See our <a href="${networkConnectionDocs}" target="_blank" rel="noopener noreferrer">documentation</a> for more information.`;
    }

    if (!this.props.web3Ready) {
      message = `web3 is not available. This feature requires a browser that supports web3 or a browser plugin like MetaMask. 
      <br/><br/> See our <a href="${networkConnectionDocs}" target="_blank" rel="noopener noreferrer"> documentation</a> for more information.`;
    }

    return { __html: message };
  }

  showChildren() {
    return (
      this.props.web3Ready &&
      this.props.networkReady &&
      (this.props.accountsReady || this.props.skipAccounts) &&
      (this.props.contractsReady || this.props.skipContracts)
    );
  }

  render() {
    return (
      <div>
        {this.showChildren() ? (
          { ...this.props.children }
        ) : (
          <div className="loader" style={{ minHeight: '150px' }}>
            {!this.props.showTip ? (
              <div>
                <div className="spinner">
                  <div className="bounce1" />
                  <div className="bounce2" />
                  <div className="bounce3" />
                </div>
                <p>web3 loading...</p>
              </div>
            ) : (
              <div>
                <img
                  src={WarningIcon}
                  alt="warning icon"
                  style={{ marginTop: '1em' }}
                />

                <p dangerouslySetInnerHTML={this.selectMessage()} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3Ready: state.web3.web3Ready,
    networkReady: state.web3.networkReady,
    network: state.web3.network,
    showTip: state.web3.showTip,
    accountsReady: state.account.accountsReady,
    contractsReady: state.contracts.contractsReady
  };
};

export default connect(
  mapStateToProps,
  null
)(LoadWrapper);
