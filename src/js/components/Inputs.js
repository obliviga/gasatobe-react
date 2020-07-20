import React, { useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import distance from 'google-distance-matrix';

distance.key(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

distance.units('imperial');

function Inputs() {
  const [pointA, setPointA] = useState(null);
  const [pointB, setPointB] = useState(null);

  function getDistance() {
    const origins = [`${pointA}`];
    const destinations = [`${pointB}`];

    console.log("pointA", pointA);
    console.log("pointB", pointB);

    distance.matrix(origins, destinations, (err, distances) => {
      if (err) {
        console.log(err);
      }

      if (distances.status === 'OK') {
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

  const getPointA = (data) => {
    geocodeByAddress(data.description).then(() => {
      setPointA(data.description);

      // Calculate distance only if Point B has a value
      if (pointB !== null) {
        getDistance();
      }
    }, (reason) => {
      console.error(reason);
    });
  };

  const getPointB = (data) => {
    geocodeByAddress(data.description).then(() => {
      setPointB(data.description);


      // Calculate distance only if Point A has a value
      if (pointA !== null) {
        getDistance();
      }
    }, (reason) => {
      console.error(reason);
    });
  };

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
