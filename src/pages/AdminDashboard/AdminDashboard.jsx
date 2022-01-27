import React from 'react';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="side-bar">
        <BoxApproval />
      </div>
      <div className="maps">
        <Map />
      </div>
    </div>
  );
}

export default AdminDashboard;
