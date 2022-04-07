import React from 'react';
import PropTypes from 'prop-types';

import { Td, Tr } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import styles from './ExportCSVRow.module.css';

const ExportCSVRow = ({ data }) => {
  return (
    <Tr key={data.box_id}>
      {/* eslint-disable react/no-array-index-key */}
      {Object.entries(data).map(([property, value], index) => {
        if (property === 'launched_organically') {
          return (
            <Td key={index}>
              {value === true ? (
                <CheckIcon alt="Green Check Icon" className={styles['green-check-icon']} />
              ) : (
                <CloseIcon alt="Red Cross Icon" className={styles['red-cross-icon']} />
              )}
            </Td>
          );
        }
        return <Td key={index}>{value}</Td>;
      })}
    </Tr>
  );
};

ExportCSVRow.propTypes = {
  data: PropTypes.shape({
    date: PropTypes.string,
    box_id: PropTypes.number,
    zip_code: PropTypes.string,
    general_location: PropTypes.string,
    launched_organically: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
};

export default ExportCSVRow;
