import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMobileWidth from '../../common/useMobileWidth';

import AddBoxFormMobile from './AddBoxFormMobile';
import AddBoxFormDesktop from './AddBoxFormDesktop';
import { FYABackend, formatDate, getLatLong } from '../../common/utils';
import { uploadBoxPhoto } from '../../common/FormUtils/boxFormUtils';

const AddBoxForm = () => {
  const isMobile = useMobileWidth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    const formData = data;
    formData.date = formatDate(data.date);
    formData.launchedOrganically = formData.launchedOrganically === 'yes';
    formData.picture = files.length > 0 ? await uploadBoxPhoto(files[0]) : '';
    formData.country = formData.country.value;

    const [latitude, longitude] = await getLatLong(formData.zipcode, formData.country);
    if (latitude === undefined && longitude === undefined) {
      // TODO: display toast component
      alert(`Cannot find ${formData.zipcode} in country ${formData.country}`);
    } else {
      try {
        setLoading(true);
        /* eslint-disable object-shorthand */
        await FYABackend.post('/anchorBox/box', {
          ...formData,
          latitude: latitude,
          longitude: longitude,
        });
        setLoading(false);
        navigate('/');
      } catch (err) {
        setLoading(false);
        // TODO: show error banner on failure
        console.log(err.message);
      }
    }
  };

  return (
    <>
      {isMobile ? (
        <AddBoxFormMobile onSubmit={onSubmit} files={files} setFiles={setFiles} loading={loading} />
      ) : (
        <AddBoxFormDesktop
          onSubmit={onSubmit}
          files={files}
          setFiles={setFiles}
          loading={loading}
        />
      )}
    </>
  );
};
export default AddBoxForm;
