import React from 'react';
import './PopUpBox.css';
import { ChevronRightIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function PopUpBox({ number, date }) {
  return (
    <div className="popup-box">
      <div className="popup-box-info">
        <p className="popup-box-number">{number}</p>
        <p className="popup-box-date">{date}</p>
      </div>
      <ChevronRightIcon boxSize={20} />
    </div>
  );
}

PopUpBox.propTypes = {
  number: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

export default PopUpBox;
