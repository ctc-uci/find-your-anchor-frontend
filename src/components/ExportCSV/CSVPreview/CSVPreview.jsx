import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';

import styles from './CSVPreview.module.css';
import ExportCSVRow from '../ExportCSVRow/ExportCSVRow';

const CSVPreview = ({ formValues }) => {
  return (
    <div className="csv-preview">
      <h2>CSV Preview</h2>
      <div className={`${styles['csv-preview-wrapper']} ${styles['scrollable-div']}`}>
        {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
        {formValues.length > 0 && (
          <Table className={styles['csv-preview']}>
            <Thead>
              <Tr>
                {/* eslint-disable react/no-array-index-key */}
                {Object.keys(formValues[0]).map((property, index) => (
                  <Th key={index}>{property}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {formValues.map(data => (
                <ExportCSVRow key={data.box_id} data={data} />
              ))}
            </Tbody>
          </Table>
        )}
      </div>
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
