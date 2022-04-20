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
import { FYABackend, sendEmail } from '../../../common/utils';
import AdminApprovalProcessEmail from '../../Email/EmailTemplates/AdminApprovalProcessEmail';
import styles from './RejectBoxPopup.module.css';

const RejectBoxPopup = ({
  boxHolderName,
  transactionID,
  boxID,
  boxHolderEmail,
  isOpen,
  setIsOpen,
  fetchBoxes,
  pickup,
}) => {
  const cancelRef = React.useRef();
  const [rejectionReason, setRejectionReason] = useState('');

  const handleRejectButtonClicked = async () => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      approved: false,
      status: 'evaluated',
      rejectionReason,
    });
    const requests = [
      fetchBoxes('under review', pickup),
      fetchBoxes('pending changes', pickup),
      fetchBoxes('evaluated', pickup),
      sendEmail(
        boxHolderName,
        boxHolderEmail,
        <AdminApprovalProcessEmail type="rejected" rejectionReason={rejectionReason} />,
        'Find Your Anchor Launch Map - Update',
      ),
    ];
    await Promise.all(requests);
    setIsOpen(false);
  };

  return (
    <ChakraProvider>
      <div className={styles['reject-box-popup']}>
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
                  className={styles['text-area']}
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
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
};

export default RejectBoxPopup;
