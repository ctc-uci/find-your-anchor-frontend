import React, { useEffect } from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import styles from './CSVPreviewPage.module.css';

const CSVPreviewPage = () => {
  const { state } = useLocation();

  // format CSV data when page first loads
  useEffect(() => {
    console.log(state.rows);
  }, []);

  // const data = state.rows.map(row => {
  //   const dataObj = new Object();
  //   if (row.date) {
  //     dataObj.date = row.date;
  //   }
  //   if (row.box_id) {
  //     dataObj.box_id = row.box_id;
  //   }
  //   if (row.zip_code) {
  //     dataObj.zip_code = row.zip_code;
  //   }
  //   if (row.picture) {
  //     dataObj.picture = row.picture;
  //   }
  //   if (row.general_location) {
  //     dataObj.general_location = row.general_location;
  //   }
  //   if (row.launched_organically) {
  //     dataObj.launched_organically = row.launched_organically;
  //   }
  //   if (row.message) {
  //     dataObj.message = row.message;
  //   }
  //   return dataObj;
  // });

  // const headers = [
  //   { label: "Date", key: "date" },
  //   { label: "Box #", key: "box_id" },
  //   { label: "General Location", key: "general_location" },
  //   { label: "Launched Organically", key: "launched_organically" },
  //   { label: "Message", key: "message" },
  //   { label: "Picture", key: "picture" },
  //   { label: "Zip Code", key: "zip_code" },
  // ];

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
            <Button
              // form={formID}
              // type="submit"
              className={styles['header-button']}
              colorScheme="teal"
            >
              Export CSV
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
