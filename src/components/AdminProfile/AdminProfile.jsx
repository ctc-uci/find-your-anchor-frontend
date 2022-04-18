import React from 'react';
import useMobileWidth from '../../common/FormUtils/useMobileWidth';

import AdminProfileDesktop from './AdminProfileDesktop';
import AdminProfileMobile from './AdminProfileMobile';

const AdminProfile = () => {
  const isMobile = useMobileWidth();

  return <>{isMobile ? <AdminProfileMobile /> : <AdminProfileDesktop />}</>;
};
export default AdminProfile;
