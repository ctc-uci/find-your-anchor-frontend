import { ChakraProvider, Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import UploadCSV from '../../components/UploadCSV/UploadCSV';
import './UploadCSVTemp.css';

function UploadCSVTemp() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <div>
        <h1>Upload CSV Temporary Page</h1>
        <Button onClick={onOpen}>Upload CSV</Button>
        <UploadCSV isOpen={isOpen} onClose={onClose} className="csv-modal" />
      </div>
    </ChakraProvider>
  );
}

export default UploadCSVTemp;
