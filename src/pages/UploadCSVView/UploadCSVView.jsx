import { Button, ChakraProvider, Flex, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router-dom';
// import styles from './UploadCSVView.module.css';
import CSVViewTable from '../../components/UploadCSVView/CSVViewTable/CSVViewTable';

const UploadCSVView = () => {
  const { state } = useLocation();

  return (
    <ChakraProvider>
      <Flex direction="column" margin="30px">
        <Text fontSize="xl" fontWeight="500">
          {state.filename}
        </Text>
        <CSVViewTable rows={state.rows} />
        <Stack direction="row" justify="right" marginTop="25px">
          <Button colorScheme="teal">Add to Map</Button>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};

export default UploadCSVView;
