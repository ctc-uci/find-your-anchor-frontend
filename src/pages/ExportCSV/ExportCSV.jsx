import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';
import styles from './ExportCSV.module.css';

const ExportCSV = () => {
  // Used to connect submit button outside form
  const formID = 'export-csv-form';

  const [formValues, setFormValues] = useState([]);

  const navigate = useNavigate();

  const previewCSV = e => {
    e.preventDefault();
    navigate('/export-csv-preview', { state: { rows: formValues } });
  };

  return (
    <ChakraProvider>
      <div className={styles['export-csv-wrapper']}>
        <div className={styles['export-csv-header']}>
          <div className={styles['header-text']}>
            <Text fontSize="3xl" className={styles['header-title']}>
              Export CSV
            </Text>
            <Text fontSize="lg">{formValues.length} boxes</Text>
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
              onSubmit={previewCSV()}
            >
              Preview CSV
            </Button>
          </div>
        </div>
        <div className={styles['export-csv-content']}>
          <ExportCSVForm formID={formID} setFormValues={setFormValues} />
          <CSVPreview formValues={formValues} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
