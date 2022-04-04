import React from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import styles from './ExportCSV.module.css';

const ExportCSV = () => {
  // Used to connect submit button outside form
  const formID = 'export-csv-form';

  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
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
              Preview CSV
            </Button>
          </div>
        </div>
        <div className={styles['export-csv-content']}>
          <ExportCSVForm formID={formID} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
