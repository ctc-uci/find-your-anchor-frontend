import React from 'react';
import PropTypes from 'prop-types';

import styles from './CSVPreview.module.css';

const CSVPreview = ({ formValues }) => {
  return (
    <div className={`${styles['csv-preview-wrapper']} ${styles['scrollable-div']}`}>
      <p>CSV Preview</p>
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      {formValues.length > 0 && (
        <table className={styles['csv-table']}>
          <thead>
            <tr>
              {/* display each property as a <th> tag */}
              {/* eslint-disable react/no-array-index-key */}
              {Object.keys(formValues[0]).map((property, index) => (
                <th key={index}>{property}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formValues.map(data => (
              <h1 key={data.box_id}>{data.box_id}</h1>
            ))}
          </tbody>
        </table>
      )}
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
  formValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default CSVPreview;
