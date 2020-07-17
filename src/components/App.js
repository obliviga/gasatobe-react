/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import Inputs from './Inputs';
import Car from './Car';

import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  
  return (
    <div>
      <h1>Gasatobe ⛽<Car /></h1>
      <h2>Find out how much you'll spend in gas travelling from Point A to B!</h2>
      <Inputs />
    </div>
  );
}

export default App;
