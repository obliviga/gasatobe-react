import React, { useState, useCallback, useEffect } from 'react';
import convert from 'xml-js';
import fetch from 'node-fetch';
import PlacesInputs from './components/PlacesInputs';
import EmojiContainer from './components/EmojiContainer';

import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  const [distance, setDistance] = useState();
  const [year, setYear] = useState();
  const [makes, setMakes] = useState([]);
  const [make, setSelectedMake] = useState();
  const [models, setModel] = useState([]);

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

  const fetchModels = () => {
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`)
      // Using text() because response is XML
      .then((response) => response.text())
      .then((data) => {
        // Converting retrieved XML to JS object
        const modelsByYearUnformatted = convert.xml2js(data, { compact: true, spaces: 2 });

        // Traversing object so it's more readable
        const modelsByYear = modelsByYearUnformatted.menuItems.menuItem;

        // Creating a local empty array for future storage
        const modelsLocal = [];

        for (let i = 0; i < modelsByYear.length; i += 1) {
          // For each make by year, push it into the local array defined above
          modelsLocal.push(modelsByYear[i].text._text);
        }

        // Store local array into makes state
        setModel(modelsLocal);
      })
      .catch((error) => console.log('error is', error));
  };

  const handleChangeYear = (e) => {
    // Get the value of the year dropdown and store it in year state
    setYear(e.target.value);
  };

  // Creating callback to make sure year is defined before fetching makes
  const fetchMakesCallback = useCallback(() => {
    if (year) {
      fetchMakesByYear();
    }
  }, [year]);

  // Creating callback to make sure make is defined before fetching models
  const fetchModelsCallback = useCallback(() => {
    if (make) {
      fetchModels();
    }
  }, [make]);

  // Fetch makes each time year is updated
  useEffect(() => {
    fetchMakesCallback();
  }, [fetchMakesCallback]);

  // Fetch models each time make is updated
  useEffect(() => {
    fetchModelsCallback();
  }, [fetchModelsCallback]);

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
      // Get the value of the makes dropdown and store it in make state
      setSelectedMake(e.target.value);
    }

    return (
      <select aria-label="Select a make" onChange={(e) => handleChangeMake(e)} value={make}>
        {/* Populate with option elements based on the years state and its index */}
        <option value="">Select a make</option>
        {makes.map((value, index) => <option key={makes[index]}>{value}</option>)}
      </select>
    );
  };

  const Models = () => {
    function handleChangeModel(e) {
      // TODO: make a request to get MPG?
    }

    return (
      <select aria-label="Select a model" onChange={(e) => handleChangeModel(e)}>
        {/* Populate with option elements based on the make state and its index */}
        <option value="">Select a model</option>
        {models.map((value, index) => <option key={makes[index]}>{value}</option>)}
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

      <h3>Select your vehicle:</h3>

      <Years />
      <Makes />
      <Models />
    </div>
  );
}

export default App;
