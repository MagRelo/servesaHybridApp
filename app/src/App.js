import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

// CSS
import './css/open-sans.css';
import './css/pure-min.css';
import './index.css';

import LandingPage from 'components/landingPage';
import teamPage from 'components/teamPage';
import updateTourney from 'components/updateTourney';
// import Auto from 'components/autoPage';

class App extends Component {
  state = { accounts: null };

  render() {
    return (
      <div>
        <div className="container">
          <Switch>
            <Route component={teamPage} path="/team/:teamName" />
            <Route component={updateTourney} path="/admin" />
            <Route component={LandingPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
