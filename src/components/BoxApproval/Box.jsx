import React from 'react';
import { HStack, VStack, Button, Text, Spacer } from '@chakra-ui/react';
import './BoxApproval.css';

function Box() {
  return (
    <div className="box">
      <HStack className="boxHeader">
        <VStack spacing={0} align="left" className="boxHeaderInfo">
          <Text fontSize="6xl">Box #</Text>
          <Text>date</Text>
        </VStack>
        <Spacer />
        <Button size="xs" className="approveButton">
          <p className="buttonText">No</p>
        </Button>
        <Button size="xs" className="approveButton">
          <p className="buttonText">Yes</p>
        </Button>
      </HStack>
      <VStack spacing={0} direction="column" align="left" className="boxContent">
        <Text>ID</Text>
        <Text>Date</Text>
        <Text>Zip Code</Text>
        <Text>Description / Notes</Text>
      </VStack>
    </div>
  );
}
export default Box;
