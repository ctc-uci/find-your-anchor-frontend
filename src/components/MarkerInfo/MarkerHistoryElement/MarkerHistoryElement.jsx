import React from 'react';
import PropTypes from 'prop-types';
import launchBoxIcon from '../../../assets/BoxIcons/RelocateBoxIcon.svg';
import foundBoxIcon from '../../../assets/BoxIcons/PickupBoxIcon.svg';

import styles from './MarkerHistoryElement.module.css';

// MarkerHistoryElement is a subcomponent of the History section of BoxInfo.
const MarkerHistoryElement = ({ id, boxLocation, date, pickup }) => {
  return (
    <div className={styles.wrapper} id={`wrapper-${id}`}>
      {/* This div has to be here or else there's too much padding between the connecting lines */}
      <div>
        <img
          id={`box-history-element-${id}`}
          className={styles['box-icon']}
          src={pickup ? foundBoxIcon : launchBoxIcon}
          alt="box-icon"
        />
      </div>
      {/* Section containing the box's general location and date */}
      <div className={styles[`text-wrapper`]}>
        <p className={styles['box-location']}>{boxLocation}</p>
        <p className={styles['box-date']}>{date}</p>
      </div>
    </div>
  );
};

MarkerHistoryElement.propTypes = {
  id: PropTypes.number.isRequired,
  boxLocation: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  pickup: PropTypes.bool.isRequired,
};

export default MarkerHistoryElement;
