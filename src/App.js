import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
// import createHistory from 'history/createBrowserHistory';

import Home from './views/Home';
import ImageInput from './views/ImageInput';
import VideoInput from './views/VideoInput';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <Router history={createHistory()}> */}
        <Router>
          <div className="route">
            <Route exact path="/" component={Home} />
            <Route exact path="/photo" component={ImageInput} />
            <Route exact path="/camera" component={VideoInput} />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
