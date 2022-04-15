import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMobileWidth from '../../common/useMobileWidth';

import PickupBoxFormMobile from './PickupBoxFormMobile';
import PickupBoxFormDesktop from './PickupBoxFormDesktop';
import { FYABackend, formatDate } from '../../common/utils';
import { uploadBoxPhoto } from '../../common/FormUtils/boxFormUtils';

const PickupBoxForm = ({ setFormSubmitted }) => {
  const isMobile = useMobileWidth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';

    try {
      setLoading(true);
      await FYABackend.post('/boxHistory', {
        ...formData,
        pickup: true,
        status: 'under review',
        messageStatus: 'pending',
        imageStatus: 'pending',
      });

      setFormSubmitted(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      // TODO: show error banner on failure
      console.log(err.message);
    }
  };

  return (
    <>
      {isMobile ? (
        <PickupBoxFormMobile
          onSubmit={onSubmit}
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      ) : (
        <PickupBoxFormDesktop
          onSubmit={onSubmit}
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      )}
    </>
  );
};

PickupBoxForm.propTypes = {
  setFormSubmitted: PropTypes.func.isRequired,
};

export default PickupBoxForm;
