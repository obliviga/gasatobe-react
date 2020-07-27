import React, { useState } from 'react';

const GasPrice = ({ parentCallback }) => {
  const [gasPrice, setGasPrice] = useState();

  const handleOnChange = (e) => {
    if (e.target.value > 0) {
      setGasPrice(e.target.value);
      parentCallback(e.target.value);
    } else {
      // TODO: Error message
      console.log('Gas prices can only be positive values lol');
    }
  };

  return (
    <label htmlFor="gasPrice">
      Update how much you pay for gas per gallon:&nbsp;
      <input id="gasPrice" type="number" placeholder="e.g. 2.99" defaultValue={2.99} onChange={handleOnChange} min="0" max="10" step=".01" autoFocus/>
    </label>
  );
};

export default GasPrice;
