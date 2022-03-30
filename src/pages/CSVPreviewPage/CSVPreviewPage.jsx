/* eslint-disable object-shorthand */
import React from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import { CSVLink } from 'react-csv';
import { useLocation } from 'react-router-dom';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import styles from './CSVPreviewPage.module.css';

const CSVPreviewPage = () => {
  const { state } = useLocation();

  const data = state.rows.map(row => {
    const dataObj = {};
    if (row.date) {
      dataObj.date = row.date;
    }
    if (row.box_id) {
      dataObj.box_id = row.box_id;
    }
    if (row.zip_code) {
      dataObj.zip_code = row.zip_code;
    }
    if (row.picture) {
      dataObj.picture = row.picture;
    }
    if (row.general_location) {
      dataObj.general_location = row.general_location;
    }
    if (row.launched_organically) {
      dataObj.launched_organically = row.launched_organically;
    }
    if (row.message) {
      dataObj.message = row.message;
    }
    return dataObj;
  });

  const headers = Object.keys(state.rows[0]).map(property => {
    const headerObj = {};
    switch (property) {
      case 'date':
        headerObj.label = 'Date';
        headerObj.key = 'date';
        return headerObj;
      case 'box_id':
        headerObj.label = 'Box #';
        headerObj.key = 'box_id';
        return headerObj;
      case 'zip_code':
        headerObj.label = 'General Location';
        headerObj.key = 'general_location';
        return headerObj;
      case 'picture':
        headerObj.label = 'Launched Organically';
        headerObj.key = 'launched_organically';
        return headerObj;
      case 'general_location':
        headerObj.label = 'Message';
        headerObj.key = 'message';
        return headerObj;
      case 'launched_organically':
        headerObj.label = 'Picture';
        headerObj.key = 'picture';
        return headerObj;
      case 'message':
        headerObj.label = 'Zip Code';
        headerObj.key = 'zip_code';
        return headerObj;
      default:
        return headerObj;
    }
  });

  const csvReport = {
    data: data,
    headers: headers,
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
