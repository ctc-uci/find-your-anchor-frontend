import React from 'react';
import PropTypes from 'prop-types';
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
  // Deletes the currently selected box in both Anchor_Box and Box_History
  const deleteBox = async () => {
    try {
      const deleteRequests = [
        // Delete the box in Box_History
        await FYABackend.delete(`/boxHistory/${selectedBox.box_id}`),
        // Delete the box in Anchor_Box
        await FYABackend.delete(`/anchorBox/${selectedBox.box_id}`),
      ];
      await Promise.allSettled(deleteRequests);
      // Refetch box list
      const anchorBoxesInZipCode = await FYABackend.get('/anchorBox', {
        params: {
          zipCode: selectedZipCode,
          country: selectedCountry,
        },
      });
      // If the box list is now empty, remove marker from map
      if (anchorBoxesInZipCode.data.length === 0) {
        setZipCodeData(
          zipCodeData.filter(
            zipCodeInfo =>
              zipCodeInfo.zip_code !== selectedBox.zip_code ||
              zipCodeInfo.country !== selectedBox.country,
          ),
        );
        setSelectedZipCode(null);
        setSelectedCountry(null);
        // If box list is not empty, decrement the marker's label
      } else {
        // Find the marker inside zipCodeData
        const index = zipCodeData.findIndex(
          zipCodeInfo =>
            zipCodeInfo.zip_code === selectedBox.zip_code &&
            zipCodeInfo.country === selectedBox.country,
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
      console.log(err.message);
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
};

export default DeleteBoxModal;
