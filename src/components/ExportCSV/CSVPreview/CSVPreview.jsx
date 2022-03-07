import React from 'react';
import PropTypes from 'prop-types';

import styles from './CSVPreview.module.css';

const CSVPreview = ({ data }) => {
  return (
    <div className={styles['csv-preview-wrapper']}>
      <p>CSV Preview</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

// CSVPreview.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       date: PropTypes.string,
//       boxNum: PropTypes.number,
//       zipCode: PropTypes.string,
//       organicLaunch: PropTypes.bool,
//       imgUrl: PropTypes.string,
//     }),
//   ).isRequired,
// };

CSVPreview.propTypes = {
  // data: PropTypes.shape({
  //   temp: PropTypes.string,
  // }).isRequired,
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default CSVPreview;
