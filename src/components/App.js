import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  return (
    <div>
      <GooglePlacesAutocomplete
        onSelect={console.log}
        apiKey="AIzaSyAZkLCYvD63E0h1EL7SDqEIceqEhszVVFo"
      />
    </div>
  );
}

export default App;
