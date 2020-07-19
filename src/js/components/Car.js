/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useState } from 'react';

import '../../scss/car.scss';
import explosion from '../../images/explosion.gif';

function Car() {
  // Initial state
  const [animate, addClass] = useState('');

  // Add class on click
  function handleClick() {
    addClass('animate');
  }

  if (animate) {
    return (
      <span className="emoji-container">
        <img src={explosion} className="explosion" role="presentation" />
        <span role="button" onClick={handleClick} className="car-emoji animate">🚗</span>
      </span>
    );
  }
  return (
    <span className="emoji-container">
      <span className="gas-emoji">⛽</span>
      <span role="button" onClick={handleClick} className="car-emoji">🚗</span>
    </span>
  );
}

export default Car;
