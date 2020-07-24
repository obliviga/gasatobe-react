import React, { useState, useCallback, useEffect } from 'react';
import convert from 'xml-js';
import fetch from 'node-fetch';
import PlacesInputs from './components/PlacesInputs';
import EmojiContainer from './components/EmojiContainer';

import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  const [distance, setDistance] = useState();
  const [year, setState] = useState();
  const [makes, setMakes] = useState([]);

  // Getting data from input fields and setting the distance in state
  const getInputData = (data) => {
    setDistance(data);
  };

  const fetchMakesByYear = () => {
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`)
      // Using text() because response is XML
      .then((response) => response.text())
      .then((data) => {
        // Converting retrieved XML to JS object
        const makesByYearUnformatted = convert.xml2js(data, { compact: true, spaces: 2 });

        // Traversing object so it's more readable
        const makesByYear = makesByYearUnformatted.menuItems.menuItem;

        // Creating a local empty array for future storage
        const makesLocal = [];

        for (let i = 0; i < makesByYear.length; i += 1) {
          // For each make by year, push it into the local array defined above
          makesLocal.push(makesByYear[i].text._text);
        }

        // Store local array into makes state
        setMakes(makesLocal);
      })
      .catch((error) => console.log('error is', error));
  };

  const handleChangeYear = (e) => {
    // Get the value of the year dropdown and store it in year state
    setState(e.target.value);
  };

  // Creating callback to make sure year is defined before fetching
  const fetchYearCallback = useCallback(() => {
    if (year) {
      fetchMakesByYear();
    }
  }, [year]);

  // Fetch once above dependencies are met
  useEffect(() => {
    fetchYearCallback();
  }, [fetchYearCallback]);

  const Years = () => {
    const years = [];

    // Iterating through 1999 to the current year
    for (let i = 1999; i < new Date().getFullYear(); i += 1) {
      // Add the index to the array, plus 1 to each index
      years.push(i + 1);
    }

    return (
      <select aria-label="Select a year" onChange={(e) => handleChangeYear(e)} value={year}>
        {/* Populate with option elements based on the years state and its index */}
        <option value="">Select a year</option>
        {years.map((value, index) => <option key={years[index]}>{value}</option>)}
      </select>
    );
  };

  const Makes = () => {
    function handleChangeMake(e) {
      // TODO: Get Models
    }

    return (
      <select aria-label="Select a make" onChange={(e) => handleChangeMake(e)}>
        {/* Populate with option elements based on the years state and its index */}
        <option value="">Select a make</option>
        {makes.map((value, index) => <option key={makes[index]}>{value}</option>)}
      </select>
    );
  };

  return (
    <div>
      <h1>Gasatobe <EmojiContainer /></h1>
      <h2>Find out how much you'll spend in gas travelling from Point A to B!</h2>
      <PlacesInputs parentCallback={getInputData} />
      {distance !== undefined && (
        <p>
          The driving distance from Point A to B is&nbsp;
          <strong>{distance.rows[0].elements[0].distance.text}</strong>.
        </p>
      )}
      <Years />
      <Makes />
    </div>
  );
}

export default App;
