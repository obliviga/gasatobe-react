import React, { useState } from 'react';

const Years = () => {
  const [years] = useState([]);

  // Iterating through 1999 to the current year
  for (let i = 1999; i < new Date().getFullYear(); i += 1) {
    // Add the index to the state, plus 1 to each index
    years.push(i + 1);
  }

  return (
    <div>
      <label htmlFor="yearSelect">
        Select a year <br />
        <select name="year" id="yearSelect">
          {/* Populate with option elements based on the years state and its index */}
          {years.map((value, index) => <option key={years[index]}>{value}</option>)}
        </select>
      </label>
    </div>
  );
}

export default Years;
