import React from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import styles from './ExportCSV.module.css';

import useMobileWidth from '../../common/useMobileWidth';
import ChakraTheme from '../../common/ChakraTheme';

const ExportCSV = () => {
  // Used to connect submit button outside form
  const formID = 'export-csv-form';

  const isMobile = useMobileWidth();
  return (
    <ChakraProvider theme={ChakraTheme}>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text textStyle="header-1" className={styles['header-title']}>
              Export CSV
            </Text>
          </div>
          {!isMobile && (
            <div className={styles['button-section']}>
              <Button form={formID} type="submit" colorScheme="button">
                Preview CSV
              </Button>
            </div>
          )}
        </div>
        <div className={styles['export-csv-content']}>
          <ExportCSVForm formID={formID} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
