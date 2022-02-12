import React from 'react';
import Map from '../../components/Map/Map';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import NavBar from '../../components/NavBar/NavBar';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-nav-bar">
        <NavBar />
      </div>
      <div className="side-bar-and-map-container">
        <div className="side-bar">
          <BoxApproval />
        </div>
        <div className="map">
          <Map />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
