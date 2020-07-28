import React, { useState } from 'react';
import { toast } from 'react-toastify';

import '../../scss/gasPrice.scss';

const GasPrice = ({ parentCallback }) => {
  const [gasPrice, setGasPrice] = useState();

  const handleOnChange = (e) => {
    // If user enters a negative number, show error toast
    if (Math.sign(e.target.value) === -1) {
      toast.error('Gas prices can only be positive values 🤓', { autoClose: 7000 });
    } else {
      setGasPrice(e.target.value);
      parentCallback(e.target.value);
    }
  };

  return (
    <label htmlFor="gasPrice">
      <span>Update how much you pay for gas per gallon:&nbsp;</span>
      <input id="gasPrice" type="number" placeholder="e.g. 2.99" defaultValue={2.99} onChange={handleOnChange} min="0" max="10" step=".01" autoFocus />
    </label>
  );
};

export default GasPrice;
