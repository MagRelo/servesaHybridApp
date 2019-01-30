import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import ethUtil from 'ethereumjs-util';

import store from 'state/store';
import { sendData } from 'state/loadSockets';

const { soliditySha3 } = require('web3-utils');

function setInputType(contractType) {
  if (contractType === 'uint256') {
    return 'number';
  }

  return 'text';
}

const FormDisplay = ({ label, value }) => {
  return (
    <div
      className="row"
      style={{ gridTemplateColumns: 'auto 1fr auto', margin: '1em 0' }}
    >
      <div>{label}</div>
      <div style={{ borderBottom: 'dashed 1px lightgray' }} />
      <div>{value}</div>
    </div>
  );
};

class BouncerForm extends Component {
  state = {
    isWhiteListed: false,
    whitelistStatus: false,
    inputs: []
  };

  componentDidMount() {
    this.getWhitelistStatus();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.selectedAccount !== this.props.selectedAccount) {
      this.getWhitelistStatus();
    }
  }

  async getWhitelistStatus() {
    const bouncerProxyInstance = store.getState().contracts.bouncerProxy;

    const status = await bouncerProxyInstance.methods
      .whitelist(this.props.selectedAccount)
      .call({ from: this.props.selectedAccount });

    console.log('updated whitelist status for', this.props.selectedAccount);
    this.setState({
      whitelistStatus: status,
      whitelistStatus_display: status ? 'Approved' : 'Not Approved',
      bouncerAddress: bouncerProxyInstance._address
    });
  }

  contractSelect(option) {
    // build method list
    const targetContract = store.getState().contracts[option.value];
    let methods = [];
    for (var key in targetContract._jsonInterface) {
      if (targetContract._jsonInterface[key].type === 'function') {
        methods.push(targetContract._jsonInterface[key]);
      }
    }

    this.setState({
      contract: option.value,
      methodList: methods.map(method => {
        return { value: method.name, label: method.name };
      })
    });
  }

  methodSelect(option) {
    const targetContract = store.getState().contracts[this.state.contract];

    let methodSpec = null;
    for (var key in targetContract._jsonInterface) {
      if (
        option.value === targetContract._jsonInterface[key].name &&
        targetContract._jsonInterface[key].type === 'function'
      ) {
        methodSpec = targetContract._jsonInterface[key];
      }
    }

    this.setState({
      method: option.value,
      name: methodSpec.name,
      inputs: methodSpec.inputs,
      stateMutability: methodSpec.stateMutability
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    // set loading state
    this.setState({
      formSubmitting: true
    });

    try {
      const web3 = store.getState().web3.instance;
      const bouncerProxyInstance = store.getState().contracts.bouncerProxy;
      const selectedAccount = store.getState().account.selectedAccount;

      // build txn data
      const targetContract = store.getState().contracts[this.state.contract];
      const params = [];
      this.state.inputs.forEach(input => {
        if (input.type === 'uint256') {
          params.push(parseInt(this.state[input.name], 10));
        } else {
          params.push(this.state[input.name]);
        }
      });
      const txnData = targetContract.methods[this.state.method](
        ...params
      ).encodeABI();

      // test vars
      const targetAmount = 0,
        rewardAmount = 0,
        accountNonce = 0;
      const rewardAddress = '0x0000000000000000000000000000000000000000';

      // hash & sign message
      const parts = [
        bouncerProxyInstance._address,
        selectedAccount,
        targetContract._address,
        web3.utils.toTwosComplement(targetAmount),
        txnData,
        rewardAddress,
        web3.utils.toTwosComplement(rewardAmount),
        web3.utils.toTwosComplement(accountNonce)
      ];
      const message = soliditySha3(...parts);
      const contentAsHex = ethUtil.bufferToHex(new Buffer(message, 'utf8'));

      // sign transaction
      web3.currentProvider.sendAsync(
        {
          method: 'personal_sign',
          params: [contentAsHex, selectedAccount],
          from: selectedAccount
        },
        async (error, response) => {
          if (error) return console.error(error);
          if (response.error) {
            return this.setState({
              formError: true,
              formAlert: true,
              formSubmitting: false,
              formMessage: 'User denied signature.'
            });
          }

          // send to server
          const signature = response.result;
          sendData('bounce-txn', { parts, message, contentAsHex, signature });

          this.setState({
            formSuccess: true,
            formAlert: true,
            formSubmitting: false,
            formMessage: 'Submitted...'
          });
        }
      );
    } catch (error) {
      console.log(error.message);

      this.setState({
        formError: true,
        formAlert: true,
        formSubmitting: false,
        formMessage: error.message
      });
    }
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  resetForm() {
    this.setState({
      formAlert: false,
      formError: false,
      formSuccess: false,
      formSubmitting: false,
      formMessage: ''
    });
  }

  formFeild(input) {
    return (
      <div key={input.name}>
        <label htmlFor="">{input.name}</label>
        <input
          type={setInputType(input.type)}
          name={input.name}
          placeholder={input.type}
          onChange={this.handleFormChange.bind(this)}
        />
      </div>
    );
  }

  alertClass() {
    if (this.state.formError) return 'alert error';
    if (this.state.formSuccess) return 'alert success';
  }

  render() {
    return (
      <form
        name="signatureForm"
        className="pure-form"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <legend>Bounce Transaction </legend>

        <p>Server Account</p>
        <div className="form-display-box">
          <FormDisplay
            label="Server Account"
            value={this.props.serverAccount}
          />
          <FormDisplay
            label="Server Account Balance"
            value={this.props.serverAccountBalance}
          />
        </div>

        <p>Bouncer Contract</p>
        <div className="form-display-box">
          <FormDisplay label="Contract" value={'asdf'} />
          <FormDisplay label="Reward" value={'adsf'} />
        </div>

        <p>Web3 Account</p>
        <div className="form-display-box">
          <FormDisplay
            label="Web3 Account"
            value={this.props.selectedAccount}
          />
          <FormDisplay
            label="Account Status"
            value={this.state.whitelistStatus_display}
          />
        </div>

        <p>Transaction</p>
        <fieldset style={{ padding: '0 1em 1em', fontSize: 'smaller' }}>
          <label htmlFor="contractSelect">Select Target Contract</label>
          <Select
            options={this.props.contractList}
            name="contractSelect"
            onChange={this.contractSelect.bind(this)}
          />
          <label htmlFor="methodSelect">Select Contract Method</label>
          <Select
            options={this.state.methodList}
            name="methodSelect"
            onChange={this.methodSelect.bind(this)}
          />

          <fieldset style={{ padding: '0 1em' }}>
            {this.state.inputs.map(input => {
              return this.formFeild(input);
            })}
          </fieldset>
        </fieldset>

        <hr />
        <button className="pure-button pure-button-primary" type="submit">
          Submit
        </button>

        {this.state.formSubmitting ? (
          <span style={{ fontSize: 'smaller', marginLeft: '1em' }}>
            Waiting for MetaMask...
          </span>
        ) : null}

        {this.state.formAlert ? (
          <div className={this.alertClass()}>
            <p>{this.state.formMessage}</p>
            <p>clientSubmitted: {this.props.clientSubmitted}</p>
            <p>serverRecieved: {this.props.serverRecieved}</p>
            <p>serverSubmitted: {this.props.serverSubmitted}</p>
            <p>serverComplete: {this.props.serverComplete}</p>

            <button className="pure-button" onClick={this.resetForm.bind(this)}>
              Ok
            </button>
          </div>
        ) : null}
        <div>
          {/* <p>Debug</p>
          <pre>{JSON.stringify(this.state, null, 2)}</pre> */}
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedAccount: state.account.selectedAccount,

    contractList: state.contracts.contractList,

    serverAccount: state.bounce.serverAccount,
    serverAccountBalance: state.bounce.serverAccountBalance,
    clientSubmitted: state.bounce.clientSubmitted.toString(),
    serverRecieved: state.bounce.serverRecieved.toString(),
    serverSubmitted: state.bounce.serverSubmitted.toString(),
    serverComplete: state.bounce.serverComplete.toString()
  };
};

export default connect(
  mapStateToProps,
  null
)(BouncerForm);
