import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress} from 'react-google-places-autocomplete';
import distance from 'google-distance-matrix';

distance.key(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

distance.units('imperial');

let points = {
	pointA: null,
  pointB: null
};

function getDistance() {
  let origins = [`${points.pointA}`];
  let destinations = [`${points.pointB}`];

  distance.matrix(origins, destinations, function (err, distances) {
    if (err) {
      console.log(err);
    }

    if (!distances) {
      console.log('no distances');
    }

    if (distances.rows[0].elements[0].status === "ZERO_RESULTS") {
      console.log(`Sorry, Google Maps doesn't have specific geolocation data for this place or address yet: ${distances.origin_addresses[0]}`);
    }

    if (distances.status === 'OK' ) {
      console.log(distances.rows[0].elements[0].distance.value);
    }
  });
}

function getPointA(data) {
  geocodeByAddress(data.description).then(value => {
    points.pointA = data.description;

    if (points.pointB !== null) {
      getDistance();
    }
  }, reason => {
    console.error(reason); // Error!
  });
}

function getPointB(data) {
  geocodeByAddress(data.description).then(value => {
    points.pointB = data.description;

    if (points.pointA !== null) {
      getDistance();
    }
  }, reason => {
    console.error(reason); // Error!
  });
}

function Inputs() {
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

export default Inputs;
