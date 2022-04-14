import React from 'react';
import useMobileWidth from '../../common/useMobileWidth';

import AddBoxFormMobile from './AddBoxFormMobile';
import AddBoxFormDesktop from './AddBoxFormDesktop';

const AddBoxForm = () => {
  const isMobile = useMobileWidth();

  return <div className="header">{isMobile ? <AddBoxFormMobile /> : <AddBoxFormDesktop />}</div>;
};
export default AddBoxForm;
