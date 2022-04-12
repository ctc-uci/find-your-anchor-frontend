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
import ShowToast from '../../../common/ShowToast/ShowToast';
import styles from './RequestChangesPopup.module.css';
import { FYABackend, sendEmail } from '../../../common/utils';
import PendingChangesBoxEmail from '../../Email/EmailTemplates/PendingChangesBoxEmail';

const RequestChangesPopup = ({
  boxHolderName,
  boxHolderEmail,
  isOpen,
  setIsOpen,
  transactionID,
  boxID,
  fetchBoxes,
}) => {
  const cancelRef = React.useRef();
  const [changesRequested, setChangesRequested] = useState('');

  const successToast = ShowToast({
    type: 'warning',
    title: `Changes for Box #${boxID} Requested`,
    message: 'A copy of your responses has been sent to the messenger.',
    toastPosition: 'bottom-right',
  });

  const errorToast = ShowToast({
    type: 'error',
    title: `Failed to Request Changes for Box #${boxID}`,
    message: 'Please try again or contact an administrator. ',
    toastPosition: 'bottom-right',
  });
  const handleRequestChangesClicked = async () => {
    try {
      await FYABackend.put('/boxHistory/update', {
        transactionID,
        boxID,
        status: 'pending changes',
        changesRequested,
      });
      const requests = [
        fetchBoxes('under review', false),
        fetchBoxes('pending changes', false),
        sendEmail(
          boxHolderName,
          boxHolderEmail,
          <PendingChangesBoxEmail
            boxHolderName={boxHolderName}
            changesRequested={changesRequested}
          />,
        ),
      ];
      await Promise.all(requests);
      setIsOpen(false);
      successToast();
    } catch (err) {
      errorToast();
    }
  };

  return (
    <ChakraProvider>
      <div className={styles['request-changes-popup']}>
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
                  className={styles['text-area']}
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
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RequestChangesPopup;
