import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useMobileWidth from '../../common/useMobileWidth';

import RelocateBoxFormMobile from './RelocateBoxFormMobile';
import RelocateBoxFormDesktop from './RelocateBoxFormDesktop';
import { FYABackend, formatDate } from '../../common/utils';
import { uploadBoxPhoto } from '../../common/FormUtils/boxFormUtils';

const RelocateBoxForm = ({ setFormSubmitted }) => {
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
        launchedOrganically: formData.dropOffMethod === 'organic-launch',
        pickup: false,
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
        <RelocateBoxFormMobile
          onSubmit={onSubmit}
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      ) : (
        <RelocateBoxFormDesktop
          onSubmit={onSubmit}
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      )}
    </>
  );
};

RelocateBoxForm.propTypes = {
  setFormSubmitted: PropTypes.func.isRequired,
};

export default RelocateBoxForm;
