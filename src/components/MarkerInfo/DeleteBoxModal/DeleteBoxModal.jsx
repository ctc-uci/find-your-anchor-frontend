import React from 'react';
import PropTypes from 'prop-types';
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
}) => {
  const closeModal = () => {
    onClose();
  };

  // Deletes the currently selected box in both Anchor_Box and Box_History
  const deleteBox = async () => {
    try {
      // Refetch box list
      const anchorBoxesInZipCode = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      const deletedBox = (await FYABackend.get(`/anchorBox/box/${selectedBox}`)).data[0];
      const deleteRequests = [
        // Delete the box in Box_History
        FYABackend.delete(`/boxHistory/box/${selectedBox}`),
        // Delete the box in Anchor_Box
        FYABackend.delete(`/anchorBox/${selectedBox}`),
      ];
      await Promise.allSettled(deleteRequests);
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
      // TODO: Add toast to show box deleted
    } catch (err) {
      // TODO: Add toast if something goes wrong
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const deleteTransaction = async () => {
    try {
      // Get the most recent transaction for the selected box
      const mostRecentTransaction = await FYABackend.get(
        `/boxHistory/mostRecentTransaction/${selectedBox}`,
      );
      // Delete the most recent transaction for the selected box
      await FYABackend.delete(
        `/boxHistory/transaction/${mostRecentTransaction.data[0].transaction_id}`,
      );
      // Get the 2nd most recent transaction for the selected box
      const nextMostRecentTransaction = await FYABackend.get(
        `/boxHistory/mostRecentTransaction/${selectedBox}`,
      );
      const [latitude, longitude] = await getLatLong(selectedZipCode, selectedCountry);
      // If there is another transaction, update the BoxInfo page
      if (nextMostRecentTransaction.data.length > 0) {
        // Copy the most recent transaction to Anchor_Box
        await FYABackend.put(`/boxHistory/approveBox`, {
          transactionID: nextMostRecentTransaction.data[0].transaction_id,
          latitude,
          longitude,
        });
        // Update boxInfo to get rid of last transaction
        setTransactionToggle(!transactionToggle);
        // Having no 2nd most recent transaction is equivalent to deleting the box
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
  selectedZipCode: null,
  selectedCountry: null,
};

DeleteBoxModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBox: PropTypes.shape({
    box_id: PropTypes.number,
    additional_comments: PropTypes.string,
    country: PropTypes.string,
    date: PropTypes.string,
    general_location: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    message: PropTypes.string,
    launched_organically: PropTypes.bool,
    picture: PropTypes.string,
    show_on_map: PropTypes.bool,
    zip_code: PropTypes.string,
    boxholder_name: PropTypes.string,
    boxholder_email: PropTypes.string,
  }).isRequired,
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
};

export default DeleteBoxModal;
