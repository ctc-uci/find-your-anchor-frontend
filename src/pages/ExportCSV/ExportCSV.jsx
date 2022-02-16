import React from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

import './ExportCSV.css';

const ExportCSV = () => {
  return (
    <ChakraProvider>
      <div className="">
        <p>Export CSV</p>
        <p>30 boxes</p>
        <div className="button-section">
          <Button className="buttons">Cancel</Button>
          <Button className="buttons" colorScheme="teal">
            Export
          </Button>
        </div>
      </div>
      <div>
        <CSVPreview />
        <ExportCSVForm />
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;