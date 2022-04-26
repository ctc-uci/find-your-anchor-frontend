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
import { FYABackend, sendEmail, AdminApprovalProcessEmailSubject } from '../../../common/utils';
import { auth, getCurrentUser } from '../../../common/auth_utils';
import AdminApprovalProcessEmail from '../../Email/EmailTemplates/AdminApprovalProcessEmail';

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

  const [toastError, setToastError] = useState('');
  const errorToast = ShowToast({
    type: 'error',
    title: `Failed to Request Changes for Box #${boxID}`,
    message: toastError,
    toastPosition: 'bottom-right',
  });
  const handleRequestChangesClicked = async () => {
    try {
      const user = await getCurrentUser(auth);
      const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
      await FYABackend.put('/boxHistory/update', {
        transactionID,
        boxID,
        status: 'pending changes',
        changesRequested,
        admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
      });
      const requests = [
        fetchBoxes('under review', false),
        fetchBoxes('pending changes', false),
        sendEmail(
          boxHolderName,
          boxHolderEmail,
          <AdminApprovalProcessEmail
            type="changes requested"
            changesRequested={changesRequested}
          />,
          AdminApprovalProcessEmailSubject,
        ),
      ];
      await Promise.all(requests);
      setIsOpen(false);
      successToast();
    } catch (err) {
      setToastError(err.message);
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
