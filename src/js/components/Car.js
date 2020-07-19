/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

function Car(props) {
  // Initial state
  const [animate, addAnimation] = useState(false);

  // Set animation state to true
  function handleClick() {
    addAnimation(true);

    // Passing onClick prop to EmojiContainer's callback on <Car />
    props.onClick();
  }

  const CarEmoji = () => <span role="button" onClick={handleClick} className="car-emoji">🚗</span>;
  const CarEmojiAnimated = () => <span role="button" onClick={handleClick} className="car-emoji animate">🚗</span>;

  // If animate state is true, render CarEmojiAnimated
  return animate ? <CarEmojiAnimated /> : <CarEmoji />;
}

export default Car;
