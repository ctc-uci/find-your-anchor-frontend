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
  selectedZipCode,
  setSelectedZipCode,
  selectedCountry,
  setSelectedCountry,
  zipCodeData,
  setZipCodeData,
  transactionToggle,
  setTransactionToggle,
  onMarkerInfoToggle,
}) => {
  const { showToast } = useCustomToast();
  const closeModal = () => {
    onClose();
  };

  // Deletes the currently selected box in both Anchor_Box and Box_History
  const deleteBox = async () => {
    try {
      const deletedBox = (await FYABackend.get(`/anchorBox/box/${selectedBox}`)).data[0];
      const deletePromises = [
        FYABackend.delete(`/boxHistory/box/${selectedBox}`),
        FYABackend.delete(`/anchorBox/${selectedBox}`),
      ];
      await Promise.allSettled(deletePromises);
      // Refetch box list
      const anchorBoxesInZipCode = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
          pageSize: 8,
          pageIndex: 1,
        },
      });
      // If the box list is now empty, remove marker from map
      if (anchorBoxesInZipCode.data.length === 0) {
        setZipCodeData(
          zipCodeData.filter(
            zipCodeInfo =>
              zipCodeInfo.zip_code !== deletedBox.zip_code ||
              zipCodeInfo.country !== deletedBox.country,
          ),
        );
        setSelectedZipCode(null);
        setSelectedCountry(null);
        onMarkerInfoToggle();
        // If box list is not empty, decrement the marker's label
      } else {
        // Find the marker inside zipCodeData
        const index = zipCodeData.findIndex(
          zipCodeInfo =>
            zipCodeInfo.zip_code === deletedBox.zip_code &&
            zipCodeInfo.country === deletedBox.country,
        );
        // Decrement the marker's box_count
        const newZipCodeInfo = {
          ...zipCodeData[index],
          box_count: zipCodeData[index].box_count - 1,
        };
        // Generate a new zipCodeData with the updated marker
        setZipCodeData([
          ...zipCodeData.filter((zipCodeInfo, pos) => pos !== index),
          newZipCodeInfo,
        ]);
      }
      // Set the delete box to null
      setSelectedBox(null);
      // Refetch markers
      const zipCodes = await FYABackend.get('/anchorBox/locations');
      setZipCodeData(zipCodes.data);
      showToast({
        title: `Box #${selectedBox} Deleted`,
        message: 'Box Successfully Deleted',
        toastPosition: 'bottom-right',
        type: 'error',
      });
    } catch (err) {
      showToast({
        title: `Failed to Delete Box #${selectedBox}`,
        message: err.message,
        toastPosition: 'bottom-right',
        type: 'error',
      });
    }
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
          // Update boxInfo to get rid of last transaction
          setTransactionToggle(!transactionToggle);
          // Having no 2nd most recent transaction is equivalent to deleting the box
        } else {
          deleteBox();
        }
      } else {
        deleteBox();
      }
      closeModal();
    } catch (err) {
      // TODO: TOAST
      console.log(err);
    }
  };
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton
      closeOnOverlayClick
      width={448}
      height={196}
    >
      <DeleteBoxModalContent deleteBox={deleteBox} deleteTransaction={deleteTransaction} />
    </CommonModal>
  );
};

DeleteBoxModal.defaultProps = {
  selectedBox: null,
  selectedZipCode: null,
  selectedCountry: null,
};

DeleteBoxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBox: PropTypes.string,
  setSelectedBox: PropTypes.func.isRequired,
  selectedZipCode: PropTypes.string,
  selectedCountry: PropTypes.string,
  setSelectedZipCode: PropTypes.func.isRequired,
  setSelectedCountry: PropTypes.func.isRequired,
  zipCodeData: PropTypes.arrayOf(
    PropTypes.shape({
      zip_code: PropTypes.string,
      country: PropTypes.string,
      longitude: PropTypes.number,
      latitude: PropTypes.number,
      box_count: PropTypes.number,
    }),
  ).isRequired,
  setZipCodeData: PropTypes.func.isRequired,
  setTransactionToggle: PropTypes.func.isRequired,
  transactionToggle: PropTypes.bool.isRequired,
  onMarkerInfoToggle: PropTypes.func.isRequired,
};

export default DeleteBoxModal;
