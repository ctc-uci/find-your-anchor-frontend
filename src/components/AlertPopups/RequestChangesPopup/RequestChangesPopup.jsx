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
import './RequestChangesPopup.css';
import FYABackend from '../../../common/utils';

const RequestChangesPopup = ({ isOpen, setIsOpen, boxID, fetchBoxes }) => {
  const cancelRef = React.useRef();
  const [changesRequested, setChangesRequested] = useState('');

  const handleRequestChangesClicked = async () => {
    await FYABackend.put('/box/relocationBoxes/update', {
      boxID,
      status: 'pending changes',
    });
    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <div className="requestChangesPopup">
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Request Changes to Box Submission
              </AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                Let the messenger know what other information you need before approving their
                submission
                <Textarea
                  value={changesRequested}
                  onChange={e => setChangesRequested(e.target.value)}
                  className="textArea"
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="orange"
                  onClick={async () => handleRequestChangesClicked()}
                  ml={3}
                >
                  Request Changes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </ChakraProvider>
  );
};

RequestChangesPopup.propTypes = {
  boxID: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RequestChangesPopup;
