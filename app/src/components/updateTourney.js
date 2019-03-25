import React, { Component } from 'react';
import { connect } from 'react-redux';

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tournamentId: '0'
    };
  }

  async submitForm(event) {
    event.preventDefault();

    // set submitting state
    this.setState({
      formFresh: false,
      formSubmitting: true,
      formMessage: 'Waiting for Metamask...'
    });

    try {
      const response = await fetch('/api/id', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tournamentId: this.state.tournamentId })
      });

      // set success state
      this.setState({
        formSubmitting: false,
        formSuccess: true,
        formMessage: 'Success!'
      });

      // console.log(metaMaskResult);
    } catch (error) {
      this.setState({
        formSubmitting: false,
        formError: true,
        formMessage: error.message
      });
      console.log(error);
    }
  }

  // Form functions
  handleChange(event) {
    console.log('asd');
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div>
        <form
          name="voteForm"
          className="pure-form"
          onSubmit={this.submitForm.bind(this)}
        >
          <legend>Update Tournament</legend>

          <fieldset>
            <label htmlFor="tourneyId">ID</label>
            <input
              type="text"
              className="pure-input"
              name="tournamentId"
              value={this.state.tournamentId}
              onChange={this.handleChange.bind(this)}
            />
          </fieldset>

          <div>
            <button type="submit" className="pure-button pure-button-primary">
              Submit
            </button>

            <span style={{ marginLeft: '1em' }}>
              {!this.state.formFresh ? (
                <span>{this.state.formMessage}</span>
              ) : null}

              {this.state.formError || this.state.formSuccess ? (
                <button
                  style={{ marginLeft: '1em' }}
                  className="pure-button"
                  onClick={() => {
                    this.setState({
                      formFresh: true,
                      formError: false,
                      formSuccess: false,
                      formSubmitting: false
                    });
                  }}
                >
                  Ok
                </button>
              ) : null}
            </span>
          </div>
        </form>
        {/* 
        <p>Debug</p>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
         */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    allPlayers: []
  };
};

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormComponent);
