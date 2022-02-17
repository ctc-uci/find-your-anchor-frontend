import React, { useState } from 'react';
import { ChakraProvider, Button, Text } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import './ExportCSV.css';

const ExportCSV = () => {
  const [formValues, setFormValues] = useState([]);

  return (
    <ChakraProvider>
      <div className="export-csv-wrapper">
        <div className="export-csv-header">
          <div className="header-text">
            <Text fontSize="3xl" className="header-title">
              Export CSV
            </Text>
            <Text fontSize="lg">30 boxes</Text>
          </div>
          <div className="button-section">
            <Button className="header-button" colorScheme="white" color="black" variant="outline">
              Cancel
            </Button>
            <Button className="header-button" colorScheme="teal">
              Export
            </Button>
          </div>
        </div>
        <div className="export-csv-content">
          <CSVPreview data={formValues} />
          <ExportCSVForm setFormValues={setFormValues} />
        </div>
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
