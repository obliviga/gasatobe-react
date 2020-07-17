import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress} from 'react-google-places-autocomplete';

function getPointA(data) {
  geocodeByAddress(data.description)
    .then(results => console.log(results))
    .catch(error => console.error(error));
}

function getPointB(data) {
  geocodeByAddress(data.description)
    .then(results => console.log(results))
    .catch(error => console.error(error));
}

function PointA() {
  return (      
    <div>
      <GooglePlacesAutocomplete
        onSelect={(data) => getPointA(data)}
        placeholder="Enter place or address for Point A"
      />

      <GooglePlacesAutocomplete
        onSelect={(data) => getPointB(data)}
        placeholder="Enter place or address for Point B"
        idPrefix="pointB"
      />
    </div>
  )
}

export default PointA;
