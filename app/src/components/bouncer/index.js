import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'components/loader';

import SignatureForm from './bouncerForm';

class LandingPage extends Component {
  state = { accounts: null, isWhitelisted: false, nonce: 0 };

  render() {
    return (
      <div>
        <h1>Bouncer</h1>

        <div className="row" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div>
            <p>
              Bounce transactions off of a bouncer contract for fun and profit
            </p>
          </div>
          <div>
            <Loader>
              <SignatureForm />
            </Loader>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);
