import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// CSS
import './css/open-sans.css';
import './css/pure-min.css';
import './index.css';

import LandingPage from 'components/landingPage';
import Bouncer from 'components/bouncer';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <div className="container">
          <Switch>
            <Route path="/bouncer" component={Bouncer} />
            <Route component={LandingPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
