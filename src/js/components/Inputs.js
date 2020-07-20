import React, { useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import googleDistanceMatrix from 'google-distance-matrix';

googleDistanceMatrix.key(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

googleDistanceMatrix.units('imperial');

// Defining object to store coordinates both points
const points = {
  pointA: null,
  pointB: null,
};

function Inputs({ parentCallback }) {
  function getDistance() {
    const origins = [`${points.pointA}`];
    const destinations = [`${points.pointB}`];

    googleDistanceMatrix.matrix(origins, destinations, (err, distances) => {
      if (err) {
        console.log(err);
      }

      if (distances.status === 'OK') {
        // If the distance can't be calculated due to the impossibility of driving from Point A to B
        if (distances.rows[0].elements[0].distance === undefined) {
          alert(`Sorry, Google Maps can't figure out how you could drive from ${distances.origin_addresses[0]} to ${distances.destination_addresses[0]}`);
        } else {
          // Pass the distance data to the parent App
          parentCallback(distances);
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

  return (
    <div>
      <GooglePlacesAutocomplete
        // Passing data from selected value to appropriate function
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
