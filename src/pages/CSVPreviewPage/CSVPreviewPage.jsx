import React from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import renameProperty from '../../components/ExportCSV/ExportCSVUtils';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import styles from './CSVPreviewPage.module.css';

const CSVPreviewPage = () => {
  const { state } = useLocation();

  const csvReport = {
    data: state.rows,
    headers: Object.keys(state.rows[0]).map(property => ({
      label: renameProperty(property),
      key: property,
    })),
    filename: 'FYA-CSV.csv',
  };

  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
            <Text fontSize="lg">{state.rows.length} boxes</Text>
          </div>
          <div className={styles['button-section']}>
            <Button
              className={styles['header-button']}
              colorScheme="white"
              color="black"
              variant="outline"
            >
              Cancel
            </Button>
            <Button className={styles['header-button']} colorScheme="teal">
              <CSVLink {...csvReport}>Export to CSV</CSVLink>
            </Button>
          </div>
        </div>
        <div className={styles['export-csv-content']}>
          <CSVPreview formValues={state.rows} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default CSVPreviewPage;
