import React from 'react';
import PropTypes from 'prop-types';
import { useCustomToast } from '../../ToastProvider/ToastProvider';
import CommonModal from '../../../common/CommonModal/CommonModal';
import DeleteBoxModalContent from './DeleteBoxModalContent';
import { FYABackend } from '../../../common/utils';

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
}) => {
  const { showToast } = useCustomToast();
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
        await FYABackend.delete(`/boxHistory/${selectedBox}`),
        // Delete the box in Anchor_Box
        await FYABackend.delete(`/anchorBox/${selectedBox}`),
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
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };
  const closeModal = () => {
    onClose();
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
      <DeleteBoxModalContent deleteBox={deleteBox} />
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
};

export default DeleteBoxModal;
