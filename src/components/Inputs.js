import React from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import distance from 'google-distance-matrix';

distance.key(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

distance.units('imperial');

// Defining object to store coordinates both points
const points = {
  pointA: null,
  pointB: null,
};

function getDistance() {
  const origins = [`${points.pointA}`];
  const destinations = [`${points.pointB}`];

  distance.matrix(origins, destinations, (err, distances) => {
    if (err) {
      console.log(err);
    }

    if (distances.status === 'OK') {
      console.log(distances);

      // If the distance can't be calculated due to the impossibility of driving from Point A to B
      if (distances.rows[0].elements[0].distance === undefined) {
        console.log(`Sorry, Google Maps can't figure out how you could drive from ${distances.origin_addresses[0]} to ${distances.destination_addresses[0]}`);
      } else {
        // Output the driving distance between the two points
        console.log(distances.rows[0].elements[0].distance.text);
      }
    }
  });
}

function getPointA(data) {
  // Geocode the address
  geocodeByAddress(data.description).then(() => {
    // Retrieve the geocoded data and store it inside local points object
    points.pointA = data.description;

    // If Point B input has a value, then calculate the distance
    if (points.pointB !== null) {
      getDistance();
    }
  }, (reason) => {
    console.error(reason); // Error!
  });
}

function getPointB(data) {
  geocodeByAddress(data.description).then(() => {
    points.pointB = data.description;

    // Calculate distance only if Point A has a value
    if (points.pointA !== null) {
      getDistance();
    }
  }, (reason) => {
    console.error(reason);
  });
}

function Inputs() {
  return (
    <div>
      <GooglePlacesAutocomplete
        // Passing data from selected value to function
        onSelect={(data) => getPointA(data)}
        placeholder="Enter place or address for Point A"
      />

      <GooglePlacesAutocomplete
        onSelect={(data) => getPointB(data)}
        placeholder="Enter place or address for Point B"
        idPrefix="pointB"
      />
    </div>
  );
}

export default Inputs;
