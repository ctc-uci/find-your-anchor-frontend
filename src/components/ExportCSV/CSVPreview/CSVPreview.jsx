import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tbody, Th, Thead, Tr, Text } from '@chakra-ui/react';

import styles from './CSVPreview.module.css';
import ExportCSVRow from '../ExportCSVRow/ExportCSVRow';
import renameProperty from '../ExportCSVUtils';
import useMobileWidth from '../../../common/useMobileWidth';

// this component is used for Export CSV
const CSVPreview = ({ formValues }) => {
  const isMobile = useMobileWidth();
  return (
    <div className={styles['csv-preview']}>
      <div className={styles['csv-preview-header']}>
        <Text className={styles['csv-preview-title']}>CSV Preview</Text>
        {isMobile && <Text fontSize="lg">{formValues.length} boxes</Text>}
      </div>
      <div className={`${styles['csv-preview-wrapper']} ${styles['scrollable-div']}`}>
        {formValues.length > 0 && (
          <Table className={styles['csv-preview']}>
            <Thead>
              <Tr>
                {/* eslint-disable react/no-array-index-key */}
                {Object.keys(formValues[0]).map((property, index) => (
                  <Th key={index}>{renameProperty(property)}</Th>
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
