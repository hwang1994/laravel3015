import React from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Home from './Home';
import ProductView from './ProductView';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/product" component={ProductView} exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

if (document.getElementById('root')) {
  ReactDOM.render(<App />, document.getElementById('root'));
}

