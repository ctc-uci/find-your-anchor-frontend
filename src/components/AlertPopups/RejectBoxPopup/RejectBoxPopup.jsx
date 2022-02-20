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

const RejectBoxPopup = ({ isOpen, setIsOpen, boxID, fetchBoxes, pickup }) => {
  const cancelRef = React.useRef();
  const [rejectionReason, setRejectionReason] = useState('');

  const handleRejectButtonClicked = async () => {
    await FYABackend.put('/box/relocationBoxes/update', {
      boxID,
      status: 'evaluated',
      rejectionReason,
    });
    const requests = [
      fetchBoxes('under review', pickup),
      fetchBoxes('pending changes', pickup),
      fetchBoxes('evaluated', pickup),
    ];
    await Promise.all(requests);
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <div className="rejectBoxPopup">
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
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RejectBoxPopup;
