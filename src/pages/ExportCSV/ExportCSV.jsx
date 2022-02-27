import React, { useState } from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import styles from './ExportCSV.module.css';

const ExportCSV = () => {
  // Used to connect submit button outside form
  const formID = 'export-csv-form';

  const [formValues, setFormValues] = useState({});

  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
            <Text fontSize="lg">30 boxes</Text>
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
              form={formID}
              type="submit"
              className={styles['header-button']}
              colorScheme="teal"
            >
              Export
            </Button>
          </div>
        </div>
        <div className={styles['export-csv-content']}>
          <ExportCSVForm formID={formID} setFormValues={setFormValues} />
          <CSVPreview data={formValues} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
