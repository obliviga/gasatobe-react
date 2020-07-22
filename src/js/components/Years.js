import React, { useState } from 'react';

const Years = () => {
  const [years] = useState([]);
  const [selectedYear, setState] = useState();

  // Iterating through 1999 to the current year
  for (let i = 1999; i < new Date().getFullYear(); i += 1) {
    // Add the index to the state, plus 1 to each index
    years.push(i + 1);
  }

  function handleChange(e) {
    setState(e.target.value);
  }

  return (
    <select aria-label="Select a year" onChange={(e) => handleChange(e)}>
      {/* Populate with option elements based on the years state and its index */}
      <option value="">Select a year</option>
      {years.map((value, index) => <option key={years[index]}>{value}</option>)}
    </select>
  );
};

export default Years;
