import React from 'react'
import GooglePlacesAutocomplete, { geocodeByAddress} from 'react-google-places-autocomplete';
import distance from 'google-distance-matrix';

distance.key('AIzaSyDzRYqFfhTGVn5M6WT-hlWiBwOHwacJfpQ');

let points = {
	"pointA": {
		"latitude": null,
		"longitude": null
	},
	"pointB": {
		"latitude": null,
		"longitude": null
	}
};

function getPointA(data) {
  geocodeByAddress(data.description)
    .then(results => (
			points.pointA.latitude = results[0].geometry.viewport.Za.i,
			points.pointA.longitude = results[0].geometry.viewport.Ua.i
			)
		).catch(error => console.error(error));
}

function getPointB(data) {
  geocodeByAddress(data.description)
    .then(results => (
			points.pointB.latitude = results[0].geometry.viewport.Za.i,
			points.pointB.longitude = results[0].geometry.viewport.Ua.i
			)
		).catch(error => console.error(error));

		console.log(points);
}

function getDistance() {
	let origins = ['San Francisco CA'];
	let destinations = ['New York NY', '41.8337329,-87.7321554'];

	distance.matrix(origins, destinations, function (err, distances) {
		if (!err) {
			console.log(distances.rows[0].elements[0].distance.value);
		}
})
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
