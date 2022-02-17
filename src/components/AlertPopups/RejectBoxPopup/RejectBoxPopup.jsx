import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import FYABackend from '../../../common/utils';
import './RejectBoxPopup.css';

const RejectBoxPopup = ({
  isOpen,
  setIsOpen,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  generalLocation,
  message,
  fetchBoxes,
}) => {
  const cancelRef = React.useRef();
  const [rejectionReason, setRejectionReason] = useState('');

  const handleRejectButtonClicked = async () => {
    await FYABackend.put('/box/relocationBoxes/update', {
      boxID,
      status: 'evaluated',
      boxHolderName,
      boxHolderEmail,
      zipCode,
      generalLocation,
      message,
      rejectionReason,
    });
    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <div className="rejectBoxPopup">
        {/* <Button colorScheme="red" onClick={() => setIsOpen(true)} className="rejectButton">
          Reject Box
        </Button> */}

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Reject Box Submission
              </AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Let the messenger know your reason for rejection
                <Textarea
                  className="textArea"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={async () => {
                    handleRejectButtonClicked();
                  }}
                  ml={3}
                >
                  Reject Box
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </ChakraProvider>
  );
};

RejectBoxPopup.propTypes = {
  boxID: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.number.isRequired,
  generalLocation: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RejectBoxPopup;
