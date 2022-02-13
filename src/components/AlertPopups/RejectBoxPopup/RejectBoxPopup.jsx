import React from 'react';
import {
  ChakraProvider,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Textarea,
} from '@chakra-ui/react';
import './RejectBoxPopup.css';

function RejectBoxPopup() {
  const [isOpen, setIsOpen] = React.useState(false);

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <ChakraProvider>
      <div className="rejectBoxPopup">
        <Button colorScheme="red" onClick={() => setIsOpen(true)} className="rejectButton">
          Reject Box
        </Button>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Reject Box Submission
              </AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Let the messenger know your reason for rejection
                <Textarea className="textArea" />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={onClose} ml={3}>
                  Reject Box
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </ChakraProvider>
  );
}

export default RejectBoxPopup;
