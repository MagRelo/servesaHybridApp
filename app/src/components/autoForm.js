import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from 'state/store';

function convertType(contractType) {
  if (contractType === 'uint256') {
    return 'number';
  }

  return 'text';
}

class AutoForm extends Component {
  state = {
    name: '',
    inputs: [],
    stateMutability: '',
    formAlert: false,
    formError: false,
    formSuccess: false,
    formSubmitting: false,
    formMessage: ''
  };

  componentDidMount() {
    // get method spec
    const contract = store.getState().contracts[this.props.contract];
    let methodSpec = null;
    for (var key in contract._jsonInterface) {
      if (
        this.props.method === contract._jsonInterface[key].name &&
        contract._jsonInterface[key].type === 'function'
      ) {
        methodSpec = contract._jsonInterface[key];
      }
    }
    this.setState({
      name: methodSpec.name,
      inputs: methodSpec.inputs,
      stateMutability: methodSpec.stateMutability
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const contract = store.getState().contracts[this.props.contract];
    const selectedAccount = store.getState().account.selectedAccount;

    // set loading state
    this.setState({
      formSubmitting: true
    });

    const params = [];
    this.state.inputs.forEach(input => {
      if (input.type === 'uint256') {
        params.push(parseInt(this.state[input.name], 10));
      } else {
        params.push(this.state[input.name]);
      }
    });
    console.log('params:', ...params);
    try {
      const reciept = await contract.methods[this.props.method](...params).send(
        {
          from: selectedAccount
        }
      );

      this.setState({
        formSuccess: true,
        formAlert: true,
        formSubmitting: false,
        formMessage: 'Success!'
      });

      return console.log(reciept);
    } catch (error) {
      this.setState({
        formError: true,
        formAlert: true,
        formSubmitting: false,
        formMessage: error.message
      });

      return console.log(error);
    }
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

  alertClass() {
    if (this.state.formError) return 'alert error';
    if (this.state.formSuccess) return 'alert success';
  }

  formFeild(input) {
    return (
      <div key={input.name}>
        <label htmlFor="">{input.name}</label>
        <input
          type={convertType(input.type)}
          name={input.name}
          placeholder={input.type}
          onChange={this.handleFormChange.bind(this)}
        />
      </div>
    );
  }

  handleFormChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <form
        name="autoForm"
        className="pure-form"
        onSubmit={this.handleSubmit.bind(this)}
      >
        <legend>
          {this.props.contract}: {this.state.name}
        </legend>

        <fieldset>
          {this.state.inputs.map(input => {
            return this.formFeild(input);
          })}
        </fieldset>

        <button className="pure-button pure-button-primary">
          {this.state.stateMutability === 'view' ? 'Call' : 'Send'}
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
    contractsReady: state.contracts.contractsReady
  };
};

export default connect(
  mapStateToProps,
  null
)(AutoForm);
