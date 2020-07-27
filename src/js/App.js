import React, { useState, useCallback, useEffect } from 'react';
import convert from 'xml-js';
import fetch from 'node-fetch';
import { toast, ToastContainer } from 'react-toastify';
import PlacesInputs from './components/PlacesInputs';
import EmojiContainer from './components/EmojiContainer';
import GasPrice from './components/GasPrice';

import 'react-toastify/dist/ReactToastify.css';
import 'react-google-places-autocomplete/dist/index.min.css';

function App() {
  const [distance, setDistance] = useState();
  const [distanceInMeters, setDistanceInMeters] = useState();
  const [year, setYear] = useState();
  const [makes, setMakes] = useState([]);
  const [make, setSelectedMake] = useState();
  const [models, setModel] = useState([]);
  const [model, setSelectedModel] = useState();
  const [trims, setTrim] = useState([]);
  const [trim, setSelectedTrim] = useState();
  const [trimsArray, setTrimsObject] = useState();
  const [vehicleId, setVehicleId] = useState();
  const [mpg, setMPG] = useState();
  const [gasPrice, setGasPrice] = useState(2.99);
  const [makesDisabled, setMakesDisabled] = useState(true);
  const [modelsDisabled, setModelsDisabled] = useState(true);
  const [trimsDisabled, setTrimsDisabled] = useState(true);
  const [isEV, setIsEV] = useState(false);

  // Getting data from input fields and setting the distance in state
  const getPointsData = (data, distanceInMetersParam) => {
    setDistance(data);
    setDistanceInMeters(distanceInMetersParam);
  };

  // Getting data from gas price input field
  const getGasPrice = (data) => {
    setGasPrice(data);
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
        const modelsByYearUnformatted = convert.xml2js(data, {
          compact: true,
          spaces: 2,
          alwaysArray: true,
        });

        // Traversing object so it's more readable
        const modelsByYear = modelsByYearUnformatted.menuItems[0].menuItem;

        // Creating a local empty array for future storage
        const modelsLocal = [];

        for (let i = 0; i < modelsByYear.length; i += 1) {
          // For each make by year, push it into the local array defined above
          modelsLocal.push(modelsByYear[i].text[0]._text[0]);
        }

        // Store local array into makes state
        setModel(modelsLocal);
      })
      .catch((error) => console.log('error is', error));
  };

  const fetchTrims = () => {
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`)
      // Using text() because response is XML
      .then((response) => response.text())
      .then((data) => {
        // Converting retrieved XML to JS object
        // Setting alwaysArray to true, so that if only one trim is returned, it will still appear
        const trimsByYearUnformatted = convert.xml2js(data, {
          compact: true,
          spaces: 2,
          alwaysArray: true,
        });

        // Traversing object so it's more readable
        const trimsByYear = trimsByYearUnformatted.menuItems[0].menuItem;

        // Creating a local empty array for future storage
        const trimsLocal = [];
        const iDsLocal = [];

        for (let i = 0; i < trimsByYear.length; i += 1) {
          // For each trims and ids by selected vals, push it into the local array defined above
          trimsLocal.push(trimsByYear[i].text[0]._text[0]);
          iDsLocal.push(trimsByYear[i].value[0]._text[0]);
        }

        // Store local array into makes state
        setTrim(trimsLocal);
        setTrimsObject(trimsByYear);
      })
      .catch((error) => console.log('error is', error));
  };

  const fetchMPG = () => {
    fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/${vehicleId}`)
      // Using text() because response is XML
      .then((response) => response.text())
      .then((data) => {
        // Converting retrieved XML to JS object
        const vehicleIdUnformatted = convert.xml2js(data, { compact: true, spaces: 2 });

        // Traversing object so it's more readable
        const mpgLocal = vehicleIdUnformatted.vehicle.comb08._text;

        // Store local mpg into state
        setMPG(mpgLocal);

        // If EV, show toast and set Make dropdown to default value
        // Disable models and trims dropdowns as well
        if (vehicleIdUnformatted.vehicle.atvType._text === 'EV') {
          setIsEV(true);
          toast('🎉 You chose an electric vehicle. CONGRATULATIONS! This app is useless for you. 🥳', { autoClose: 7000 });
          setSelectedMake();
          setModelsDisabled(true);
          setTrimsDisabled(true);
        } else {
          setIsEV(false);
        }
      })
      .catch((error) => console.log('error is', error));
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

  // Creating callback to make sure model is defined before fetching trims
  const fetchTrimsCallback = useCallback(() => {
    if (model) {
      fetchTrims();
    }
  }, [model]);

  // Creating callback to make sure trim is defined before fetching MPG
  const fetchMPGCallback = useCallback(() => {
    if (trim) {
      fetchMPG();
    }
  }, [trim]);

  // Fetch makes each time year is updated
  useEffect(() => {
    fetchMakesCallback();
  }, [fetchMakesCallback]);

  // Fetch models each time make is updated
  useEffect(() => {
    fetchModelsCallback();
  }, [fetchModelsCallback]);

  // Fetch trims each time model is updated
  useEffect(() => {
    fetchTrimsCallback();
  }, [fetchTrimsCallback]);

  // Fetch trims each time model is updated
  useEffect(() => {
    fetchMPGCallback();
  }, [fetchMPGCallback]);

  const Years = () => {
    const handleChangeYear = (e) => {
      // Get the value of the year dropdown and store it in year state
      setYear(e.target.value);

      // After year is selected, enable the Makes dropdown
      if (e.target.value) {
        setMakesDisabled(false);
      }
    };

    const years = [];

    // Iterating through 1999 to the current year
    for (let i = 1999; i < new Date().getFullYear(); i += 1) {
      // Add the index to the array, plus 1 to each index
      years.push(i + 1);

      // Reverse the values in the array so that the latest years appear first
      years.sort((a, b) => b - a);
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

      // After make is selected, enable the Models dropdown
      if (e.target.value) {
        setModelsDisabled(false);
      }
    }

    return (
      <select aria-label="Select a make" onChange={(e) => handleChangeMake(e)} value={make} disabled={makesDisabled}>
        {/* Populate with option elements based on the years state and its index */}
        <option value="">Select a make</option>
        {makes.map((value, index) => <option key={makes[index]}>{value}</option>)}
      </select>
    );
  };

  const Models = () => {
    function handleChangeModel(e) {
      setSelectedModel(e.target.value);

      // After model is selected, enable the Trims dropdown
      if (e.target.value) {
        setTrimsDisabled(false);
      }
    }

    return (
      <select aria-label="Select a model" onChange={(e) => handleChangeModel(e)} value={model} disabled={modelsDisabled}>
        {/* Populate with option elements based on the make state and its index */}
        <option value="">Select a model</option>
        {models.map((value, index) => <option key={makes[index]}>{value}</option>)}
      </select>
    );
  };

  const Trims = () => {
    function handleChangeTrim(e) {
      const indexOfSelectedTrim = trimsArray.findIndex(
        (indexes) => indexes.text[0]._text[0] === e.target.value,
      );

      // Store selected trim value into its state
      setSelectedTrim(e.target.value);

      // Store ID of vehicle, based on selected trim
      setVehicleId(trimsArray[indexOfSelectedTrim].value[0]._text[0]);
    }

    return (
      <select aria-label="Select a trim" onChange={(e) => handleChangeTrim(e)} value={trim} disabled={trimsDisabled}>
        {/* Populate with option elements based on the make state and its index */}
        <option value="">Select a trim</option>
        {trims.map((value, index) => <option key={trims[index]}>{value}</option>)}
      </select>
    );
  };

  let distanceInMiles;
  let gallonsSpent;
  let cost;
  const vehicle = `${year} ${model} ${make}`;

  if (distanceInMeters !== undefined) {
    distanceInMiles = distanceInMeters / 1609;
    gallonsSpent = distanceInMiles / mpg;
    cost = (gallonsSpent * gasPrice).toFixed(2);
  }

  return (
    <div>
      <h1>GasAtoB <EmojiContainer /></h1>
      <h2>Find out how much you'll spend in gas travelling from Point A to B!</h2>
      <PlacesInputs parentCallback={getPointsData} />
      {/* If distance exists */}
      {distance && (
        <div>
          <small>
            <i className="fas fa-map-marker-alt" />&nbsp;The driving distance from Point A to B is&nbsp;
            <strong>{distance.rows[0].elements[0].distance.text}</strong>.
          </small>

          <h3>
            Select your vehicle:
            <Years />
            <Makes disabled={makesDisabled} />
            <Models disabled={modelsDisabled} />
            <Trims disabled={trimsDisabled} />
          </h3>
        </div>
      )}

      {/* If mpg exists and a non-EV has been selected */}
      {mpg && !isEV && (
        <div>
          <small>
            <i className="fas fa-info-circle" />&nbsp;The estimated combined MPG for your {vehicle} is&nbsp;
            <strong>{mpg} miles per gallon</strong>.
          </small>

          <GasPrice parentCallback={getGasPrice} />
          <h4>
            The cost in gas to travel from Point A to Point B will be around&nbsp;
            <strong>${cost}</strong>
          </h4>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
