import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch } from 'react-router-dom';
import { ZooniverseLogo } from 'zooniverse-react-components';

import AuthContainer from '../containers/AuthContainer';
import Home from './Home';

export default function App() {
  return (
    <div>
      <header className="site-header">
        <ZooniverseLogo />
        <Link to="/" className="link"><h1 className="title">Autumnwatch 2017 Birdmap</h1></Link>
        <AuthContainer />
      </header>
      <section className="content-section">
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </section>
    </div>
  );
}

