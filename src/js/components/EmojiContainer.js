import React, { useState } from 'react';
import Car from './Car';

import '../../scss/emojiContainer.scss';
import explosion from '../../images/explosion.gif';

function EmojiContainer() {
  // Initial state
  const [animate, addAnimation] = useState(false);

  // Add class on click
  function handleClick() {
    addAnimation(true);
  }

  const EmojiContainerContent = () => <span className="gas-emoji">⛽</span>;
  const EmojiContainerContentAnimated = () => <img src={explosion} className="explosion" role="presentation" />;

  return (
    <span className="emoji-container">
      {/* If animate state is true, render EmojiContainerContentAnimated */}
      {animate ? <EmojiContainerContentAnimated /> : <EmojiContainerContent />}

      {/* Passing onClick callback to Car. */}
      <Car animate={animate} onClick={handleClick} />
    </span>
  );
}

export default EmojiContainer;
