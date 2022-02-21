import { Button, ChakraProvider, Text } from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import './UploadCSVView.css';
import CSVViewTable from '../../components/UploadCSVView/CSVViewTable/CSVViewTable';

const UploadCSVView = () => {
  const { state } = useLocation();

  return (
    <ChakraProvider>
      <div>
        <Text>{state.filename}</Text>
        <CSVViewTable rows={state.rows} />
        <Button colorScheme="teal">Add to Map</Button>
      </div>
    </ChakraProvider>
  );
};

export default UploadCSVView;
