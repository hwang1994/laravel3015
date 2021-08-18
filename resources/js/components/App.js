import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from './Home';
import ProductView from './ProductView';

const CSRF_TOKEN_URL = window.location.origin+'/token';

class App extends Component {
  componentDidMount() {
    axios.get(CSRF_TOKEN_URL, {withCredentials: true})
    .then((response) => {
      console.log(response.data);
      axios.defaults.headers.post['X-XSRF-TOKEN'] = response.data;
      axios.defaults.headers.delete['X-XSRF-TOKEN'] = response.data;
    })
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/product" component={ProductView} exact/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

if (document.getElementById('root')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}

