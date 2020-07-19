import React from 'react';
import Inputs from './components/Inputs';
import EmojiContainer from './components/EmojiContainer';

import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  return (
    <div>
      <h1>
        Gasatobe
        <EmojiContainer />
      </h1>
      <h2>Find out how much you'll spend in gas travelling from Point A to B!</h2>
      <Inputs />
    </div>
  );
}

export default App;
