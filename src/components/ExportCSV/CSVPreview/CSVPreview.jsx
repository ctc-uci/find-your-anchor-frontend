import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tbody, Th, Thead, Tr, Text } from '@chakra-ui/react';

import styles from './CSVPreview.module.css';
import ExportCSVRow from '../ExportCSVRow/ExportCSVRow';

const CSVPreview = ({ formValues }) => {
  const displayProperty = property => {
    switch (property) {
      case 'date':
        return 'Date';
      case 'box_id':
        return 'Box #';
      case 'zip_code':
        return 'Zip Code';
      case 'picture':
        return 'Image';
      case 'general_location':
        return 'Landmarks';
      case 'launched_organically':
        return 'Launched Organically?';
      case 'message':
        return 'Message';
      default:
        return '';
    }
  };

  return (
    <div className="csv-preview">
      <Text className={styles['csv-preview-title']}>CSV Preview</Text>
      <div className={`${styles['csv-preview-wrapper']} ${styles['scrollable-div']}`}>
        {formValues.length > 0 && (
          <Table className={styles['csv-preview']}>
            <Thead>
              <Tr>
                {/* eslint-disable react/no-array-index-key */}
                {Object.keys(formValues[0]).map((property, index) => (
                  <Th key={index}>{displayProperty(property)}</Th>
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

CSVPreview.propTypes = {
  formValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object])).isRequired,
};

export default CSVPreview;
