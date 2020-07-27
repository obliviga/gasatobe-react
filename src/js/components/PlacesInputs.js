import React from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../../scss/placesInputs.scss';

const { google } = window;

const googleDistanceMatrixService = new google.maps.DistanceMatrixService();

// Defining object to store coordinates both points
const points = {
  pointA: null,
  pointB: null,
};

function Inputs({ parentCallback }) {
  function getDistance(distances, status) {
    // Attempt to get the distance if both distances have been entered and the Google Maps API is up
    if (distances && status === 'OK') {
      // If the distance can't be calculated, show an error toast
      if (distances.rows[0].elements[0].status === 'ZERO_RESULTS') {
        toast.error("Your search appears to be outside of Google's current coverage area for driving. Sorry about that!");
      } else {
        const distanceInMeters = distances.rows[0].elements[0].distance.value;

        // Pass the distance data to the parent App
        parentCallback(distances, distanceInMeters);
      }
    }
  }

  // Set options for Google Distance Matrix
  function setOptions() {
    googleDistanceMatrixService.getDistanceMatrix({
      origins: [`${points.pointA}`],
      destinations: [`${points.pointB}`],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, getDistance);
  }

  function getPointA(data) {
    // Geocode the address
    geocodeByAddress(data.description).then(() => {
      // Store value from Point A input into local object
      points.pointA = data.description;

      // If Point B input has a value, then set the options and calculate the distance
      if (points.pointB !== null) {
        setOptions();
        getDistance();
      }
    }, (reason) => {
      console.error(reason); // Error!
    });
  }

  function getPointB(data) {
    geocodeByAddress(data.description).then(() => {
      // Store value from Point B input into local object
      points.pointB = data.description;

      // Set options then calculate distance only if Point A has a value
      if (points.pointA !== null) {
        setOptions();
        getDistance();
      }
    }, (reason) => {
      console.error(reason);
    });
  }

  return (
    <div className="placesInputs">
      <GooglePlacesAutocomplete
        // Passing data from selected value to appropriate function
        onSelect={(data) => getPointA(data)}
        placeholder="Enter place / address for Point A"
      />

      <GooglePlacesAutocomplete
        onSelect={(data) => getPointB(data)}
        placeholder="Enter place / address for Point B"
        idPrefix="pointB"
      />

      <ToastContainer />
    </div>
  );
}

export default Inputs;
