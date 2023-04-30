import React from 'react';
import PropTypes from 'prop-types';
import { useCustomToast } from '../../ToastProvider/ToastProvider';
import CommonModal from '../../../common/CommonModal/CommonModal';
import DeleteBoxModalContent from './DeleteBoxModalContent';
import { FYABackend, getLatLong } from '../../../common/utils';

const DeleteBoxModal = ({
  isOpen,
  onClose,
  selectedBox,
  setSelectedBox,
  setSelectedZipCode,
  setSelectedCountry,
  setZipCodeData,
  transactionToggle,
  setTransactionToggle,
}) => {
  const { showToast } = useCustomToast();
  const closeModal = () => {
    onClose();
  };

  // Deletes the currently selected box in both Anchor_Box and Box_History
  const deleteBox = async () => {
    // try {
    const deletePromises = [
      FYABackend.delete(`/boxHistory/box/${selectedBox}`),
      FYABackend.delete(`/anchorBox/${selectedBox}`),
    ];
    await Promise.all(deletePromises);
    const zipCodes = await FYABackend.get('/anchorBox/locations');
    setZipCodeData(zipCodes.data);
    setSelectedBox(null);
    showToast({
      title: `Box #${selectedBox} Deleted`,
      message: 'Box Successfully Deleted',
      toastPosition: 'bottom-right',
      type: 'error',
    });
  };

  const deleteTransaction = async () => {
    try {
      // Get the most recent transaction for the selected box
      const mostRecentTransaction = await FYABackend.get(
        `/boxHistory/mostRecentTransaction/${selectedBox}`,
      );
      if (mostRecentTransaction.data.length > 0) {
        // Delete the most recent transaction for the selected box
        await FYABackend.delete(
          `/boxHistory/transaction/${mostRecentTransaction.data[0].transaction_id}`,
        );
        // Get the 2nd most recent transaction for the selected box
        const nextMostRecentTransaction = await FYABackend.get(
          `/boxHistory/mostRecentTransaction/${selectedBox}`,
        );
        // If there is another transaction, update the BoxInfo page
        if (nextMostRecentTransaction.data.length > 0) {
          const [latitude, longitude] = await getLatLong(
            nextMostRecentTransaction.data[0].zip_code,
            nextMostRecentTransaction.data[0].country,
          );
          // Copy the most recent transaction to Anchor_Box
          await FYABackend.put(`/boxHistory/approveBox`, {
            transactionID: nextMostRecentTransaction.data[0].transaction_id,
            latitude,
            longitude,
            isMostRecentDate: true,
          });
          setSelectedZipCode(nextMostRecentTransaction.data[0].zip_code);
          setSelectedCountry(nextMostRecentTransaction.data[0].country);
          // Update boxInfo to get rid of last transaction
          setTransactionToggle(!transactionToggle);

          showToast({
            title: `Last Transaction of Box #${selectedBox} Deleted`,
            message: 'Box Successfully Deleted',
            toastPosition: 'bottom-right',
            type: 'error',
          });

          // Having no 2nd most recent transaction is equivalent to deleting the box
        } else {
          deleteBox();
        }
      } else {
        deleteBox();
      }
      closeModal();
    } catch (err) {
      showToast({
        title: 'Error Deleting Transaction',
        message: err.message,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    }
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton
      closeOnOverlayClick
      width={448}
      height={230}
    >
      <DeleteBoxModalContent deleteBox={deleteBox} deleteTransaction={deleteTransaction} />
    </CommonModal>
  );
};

DeleteBoxModal.defaultProps = {
  selectedBox: null,
};

DeleteBoxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBox: PropTypes.string,
  setSelectedBox: PropTypes.func.isRequired,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedCountry: PropTypes.func.isRequired,
  setZipCodeData: PropTypes.func.isRequired,
  setTransactionToggle: PropTypes.func.isRequired,
  transactionToggle: PropTypes.bool.isRequired,
};

export default DeleteBoxModal;
