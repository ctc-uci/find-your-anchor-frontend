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

const RequestChangesPopup = ({
  isOpen,
  setIsOpen,
  boxID,
  boxHolderNameState,
  boxHolderEmailState,
  zipCodeState,
  generalLocationState,
  messageState,
  fetchBoxes,
}) => {
  const cancelRef = React.useRef();
  const [changesRequested, setChangesRequested] = useState('');
  const updateBoxStatus = async (id, stat) => {
    await FYABackend.put('/box/relocationBoxes/update', {
      boxID: id,
      status: stat,
      boxHolderNameState,
      boxHolderEmailState,
      zipCodeState,
      generalLocationState,
      messageState,
    });
    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };

  const handleRequestChangesClicked = async () => {
    await updateBoxStatus(boxID, 'pending changes');
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <div className="requestChangesPopup">
        {/* <Button colorScheme="red" onClick={() => setIsOpen(true)} className="requestChangesButton">
          Request Changes
        </Button> */}

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
  boxHolderNameState: PropTypes.string.isRequired,
  boxHolderEmailState: PropTypes.string.isRequired,
  zipCodeState: PropTypes.number.isRequired,
  generalLocationState: PropTypes.string.isRequired,
  messageState: PropTypes.string.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RequestChangesPopup;
