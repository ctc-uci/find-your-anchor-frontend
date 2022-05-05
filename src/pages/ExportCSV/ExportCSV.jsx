import React from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import styles from './ExportCSV.module.css';

import useMobileWidth from '../../common/FormUtils/useMobileWidth';

const ExportCSV = () => {
  // Used to connect submit button outside form
  const formID = 'export-csv-form';

  const isMobile = useMobileWidth();
  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
          </div>
          {!isMobile ? (
            <div className={styles['button-section']}>
              <Button
                form={formID}
                type="submit"
                className={styles['header-button']}
                colorScheme="teal"
              >
                Preview CSV
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className={styles['export-csv-content']}>
          <ExportCSVForm formID={formID} />
        </div>
        {/* {isMobile ? (
          <div className={styles['buttons-container']}>
            <Button border="1px" borderColor="#CBD5E0" bg="white">
              Cancel
            </Button>
            <Button textColor="white" bg="#345E80">
              Export
            </Button>
          </div>
        ) : (
          ''
        )} */}
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
