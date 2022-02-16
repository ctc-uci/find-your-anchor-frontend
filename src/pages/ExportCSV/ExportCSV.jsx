import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ExportCSVForm from '../../components/ExportCSV/ExportCSVForm/ExportCSVForm';
import CSVPreview from '../../components/ExportCSV/CSVPreview/CSVPreview';

const ExportCSV = () => {
  return (
    <ChakraProvider>
      <div>
        <p>Export CSV Form</p>
        <CSVPreview />
        <ExportCSVForm />
      </div>
    </ChakraProvider>
  );
};

export default ExportCSV;
