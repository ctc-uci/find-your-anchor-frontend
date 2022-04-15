import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMobileWidth from '../../common/useMobileWidth';

import AddBoxFormMobile from './AddBoxFormMobile';
import AddBoxFormDesktop from './AddBoxFormDesktop';
import { FYABackend, formatDate } from '../../common/utils';
import { uploadBoxPhoto } from '../../common/FormUtils/boxFormUtils';

const AddBoxForm = () => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.launchedOrganically = formData.launchedOrganically === 'yes';
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';

    // send form data to server
    await FYABackend.post('/anchorBox/box', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    navigate('/admin');
  };

  return (
    <div className="header">
      {isMobile ? (
        <AddBoxFormMobile onSubmit={onSubmit} files={files} setFiles={setFiles} />
      ) : (
        <AddBoxFormDesktop onSubmit={onSubmit} files={files} setFiles={setFiles} />
      )}
    </div>
  );
};
export default AddBoxForm;
