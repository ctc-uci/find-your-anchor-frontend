import { React } from 'react';
import {
  ChakraProvider,
  Textarea,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

import './RejectBoxPopup.css';
// const RejectBoxPopup = (isOpen, setIsOpen, cancelRef, onClose) => {
const RejectBoxPopup = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const cancelRef = React.useRef();
  const onClose = () => setIsOpen(false);

  return (
    <ChakraProvider>
      <Button colorScheme="red" onClick={() => setIsOpen(true)}>
        Delete Customer
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reject Box Submission
            </AlertDialogHeader>

            <AlertDialogBody>
              Let the messenger know your reason for rejection
              <Textarea />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef}>Cancel</Button>
              <Button colorScheme="red" ml={3}>
                Reject Box
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
};

export default RejectBoxPopup;
