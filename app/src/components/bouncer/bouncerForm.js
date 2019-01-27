import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import ethUtil from 'ethereumjs-util';

import store from 'state/store';
// import { sendData } from 'state/loadSockets';

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
    accountNonce: 0,
    methodList: [
      {
        value: 0,
        label: 'pasta'
      }
    ],
    contractValue: 0,
    whitelistStatus: false,
    inputs: [],
    targetAmount: 0,
    rewardAddress: '0x0000000000000000000000000000000000000000',
    rewardAmount: 0,
    bouncerAddress: ''
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

    console.log('updated status');
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
      console.log('params:', ...params);
      const txnData = targetContract.methods[this.state.method](
        ...params
      ).encodeABI();

      // hash & sign message
      const parts = [
        bouncerProxyInstance._address,
        selectedAccount,
        targetContract._address,
        web3.utils.toTwosComplement(this.state.targetAmount),
        txnData,
        this.state.rewardAddress,
        web3.utils.toTwosComplement(this.state.rewardAmount),
        web3.utils.toTwosComplement(this.state.accountNonce)
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

          // submit signed transaction to server
          const serverResponse = await fetch('/api/bouncer', {
            method: 'POST',
            body: JSON.stringify(response)
          });

          this.setState({
            formSuccess: true,
            formAlert: true,
            formSubmitting: false,
            formMessage: serverResponse.status
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

        <p>Bouncer Contract</p>
        <fieldset style={{ padding: '0 1em', fontSize: 'smaller' }}>
          <FormDisplay label="Contract" value={this.state.bouncerAddress} />
          <FormDisplay label="Reward" value={this.state.rewardAmount} />
        </fieldset>

        <p>Account Status</p>
        <fieldset style={{ padding: '0 1em', fontSize: 'smaller' }}>
          <FormDisplay label="Account" value={this.props.selectedAccount} />
          <FormDisplay
            label="Whitelist Status"
            value={this.state.whitelistStatus_display}
          />
        </fieldset>

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
    web3Ready: state.web3.web3Ready,
    networkReady: state.web3.networkReady,
    showTip: state.web3.showTip,
    accountsReady: state.account.accountsReady,
    selectedAccount: state.account.selectedAccount,
    contractsReady: state.contracts.contractsReady,
    contractList: state.contracts.contractList
  };
};

export default connect(
  mapStateToProps,
  null
)(BouncerForm);
