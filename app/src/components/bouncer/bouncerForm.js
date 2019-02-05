import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import store from 'state/store';
import { bounceTransaction } from 'state/sockets';

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
      formSubmitting: true,
      formMessage: 'Waiting for MetaMask...'
    });

    const params = [];
    this.state.inputs.forEach(input => {
      if (input.type === 'uint256') {
        params.push(parseInt(this.state[input.name], 10));
      } else {
        params.push(this.state[input.name]);
      }
    });

    // test value
    const valueAmount = 0;

    // send to server
    bounceTransaction(
      this.state.contract,
      this.state.method,
      params,
      valueAmount
    );
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
          type={input.type === 'uint256' ? 'number' : 'text'}
          name={input.name}
          placeholder={input.type}
          onChange={this.handleFormChange.bind(this)}
        />
      </div>
    );
  }

  render() {
    return (
      <form
        name="signatureForm"
        className="pure-form"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <legend>Bounce Transaction </legend>

        <p>Web3 Account</p>
        <div className="form-display-box">
          <FormDisplay
            label="Current Account"
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

        <button className="pure-button pure-button-primary" type="submit">
          Sign & Submit
        </button>

        {this.state.formSubmitting ? (
          <div className="form-display-box">
            <FormDisplay
              label="Txn signed"
              value={this.props.clientSubmitted}
            />
            <FormDisplay
              label="Txn submitted to server"
              value={this.props.clientSubmitted}
            />
            <FormDisplay
              label="Txn received by server"
              value={this.props.serverRecieved}
            />
            <FormDisplay
              label="Txn validated and sent to chain"
              value={this.props.serverSubmitted}
            />
            <FormDisplay
              label="Txn confirmed"
              value={this.props.serverComplete}
            />

            {this.props.serverError ? (
              <p>Error: {this.props.errorMessage}</p>
            ) : null}

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
    serverComplete: state.bounce.serverComplete.toString(),
    serverError: state.bounce.serverError,
    errorMessage: state.bounce.errorMessage
  };
};

export default connect(
  mapStateToProps,
  null
)(BouncerForm);
