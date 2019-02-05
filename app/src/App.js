import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// CSS
import './css/open-sans.css';
import './css/pure-min.css';
import './index.css';

import LandingPage from 'components/landingPage';
import Bouncer from 'components/bouncer';
import Auto from 'components/autoPage';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <div className="container">
          <Switch>
            <Route path="/auto" component={Auto} />
            <Route path="/bouncer" component={Bouncer} />
            <Route component={LandingPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
