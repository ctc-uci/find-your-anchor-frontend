import React from 'react';

import AdminProfile from '../../components/AdminProfile/AdminProfile';
import styles from './AdminProfilePage.module.css';

const AdminProfilePage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <AdminProfile />
    </div>
  );
};

export default AdminProfilePage;
