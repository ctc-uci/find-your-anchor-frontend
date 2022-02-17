import React from 'react';
import PropTypes from 'prop-types';

import './CSVPreview.css';

const CSVPreview = ({ data }) => {
  return (
    <div className="csv-preview-wrapper">
      <p>CSV Preview</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

CSVPreview.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      boxNum: PropTypes.number,
      zipCode: PropTypes.string,
      organicLaunch: PropTypes.bool,
      imgUrl: PropTypes.string,
    }),
  ).isRequired,
};

export default CSVPreview;
