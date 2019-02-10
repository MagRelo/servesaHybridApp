import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import Select from 'react-select';

import store from 'state/store';

const playerCount = 10;

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contractVotes: [],
      formFresh: true,
      formSubmitting: false,
      formSuccess: false,
      formError: false,
      formMessage: '',
      votesLoading: true,
      hasVoted: false,
      playerSlot_0: null,
      playerSlot_1: null,
      playerSlot_2: null,
      playerSlot_3: null,
      playerSlot_4: null,
      playerSlot_5: null,
      playerSlot_6: null,
      playerSlot_7: null,
      playerSlot_8: null,
      playerSlot_9: null,
      playerSlot_10: null
    };
  }

  componentDidMount() {
    // eget params & loadVotes()
  }

  // async loadVotes() {
  //   const electionContract = store.getState().election.electionContractInstance;
  //   const userAddress = store.getState().web3.accounts[0];

  //   // only load one we have the election contract
  //   // if (!electionContract) return;

  //   const voterMap = await electionContract.methods
  //     .voterMap(userAddress)
  //     .call();

  //   if (!voterMap.voted) {
  //     this.setState({ votesLoading: false, hasVoted: false });
  //   } else {
  //     const contractVoteArray = await Promise.all([
  //       electionContract.methods.getVoterVote(0).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(1).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(2).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(3).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(4).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(5).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(6).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(7).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(8).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(9).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(10).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(11).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(12).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(13).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(14).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(15).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(16).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(17).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(18).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(19).call({ from: userAddress }),
  //       electionContract.methods.getVoterVote(20).call({ from: userAddress })
  //     ]);

  //     const newState = {};
  //     contractVoteArray.forEach((vote, index) => {

  //       this.props.playerSlots.forEach(player => {
  //         if (player.depositContract === vote) {
  //           newState['player_' + index] = {
  //             label: player.name,
  //             value: {
  //               depositContract: playerSlot.depositContract
  //             }
  //           };
  //         }
  //       });

  //     });

  //     // merge into state

  //     return this.setState(
  //       Object.assign(
  //         {
  //           votesLoading: false,
  //           hasVoted: true,
  //           contractVotes: contractVoteArray
  //         },
  //         newState
  //       )
  //     );
  //   }
  // }

  async submitForm(event) {
    event.preventDefault();

    // set submitting state
    this.setState({
      formFresh: false,
      formSubmitting: true,
      formMessage: 'Waiting for Metamask...'
    });

    const userAddress = store.getState().web3.accounts[0];
    const electionContract = store.getState().election.electionContractInstance;

    const votes = [];
    for (let index = 0; index < playerCount; index++) {
      votes.push(
        this.state['playerSlot_' + index]
          ? this.state['playerSlot_' + index].value.depositContract
          : '0x0000000000000000000000000000000000000000'
      );
    }

    try {
      const metaMaskResult = await electionContract.methods
        .voterUpdate(votes)
        .send({
          from: userAddress
        });

      // set success state
      this.setState({
        formSubmitting: false,
        formSuccess: true,
        formMessage: 'Success!'
      });

      console.log(metaMaskResult);
    } catch (error) {
      this.setState({
        formSubmitting: false,
        formError: true,
        formMessage: error.message
      });
      console.log(error);
    }
  }

  generateValidatorPanel() {
    let panel = [];
    for (let i = 0; i < playerCount; i++) {
      panel.push(this.validatorSelect(i));
    }
    return panel;
  }

  validatorSelect(index) {
    return (
      <div key={'playerSlot ' + index}>
        <label htmlFor={'playerSlot ' + index}>Player Group {index + 1}</label>
        <Select
          name={'playerSlot' + index}
          options={this.props.allPlayers.map(player => {
            return { label: player.name, value: player, index: index };
          })}
          onChange={this.handleChange.bind(this)}
          value={this.state['playerSlot_' + index]}
        />
      </div>
    );
  }

  // Form functions
  handleChange(option) {
    this.setState({
      ['playerSlot_' + option.index]: option
    });
  }

  render() {
    return (
      <div>
        <h1>Team Admin</h1>

        <form
          name="voteForm"
          className="pure-form"
          onSubmit={this.submitForm.bind(this)}
        >
          <legend>Set Lineup</legend>

          <div>
            <div className="row row-2">{this.generateValidatorPanel()}</div>

            <div style={{ marginTop: '2em' }}>
              <button type="submit" className="pure-button pure-button-primary">
                Submit Votes
              </button>

              <span style={{ marginLeft: '1em' }}>
                {this.state.votesLoading ? (
                  <span>Loading votes from contract...</span>
                ) : null}

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
