import { React } from 'react';
// import RejectBoxPopup from '../../components/AlertPopups/RejectBoxPopup/RejectBoxPopup';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
// import RejectBoxPopup from '../../components/AlertPopups/RejectBoxPopup/RejectBoxPopup';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="adminDashBoardDiv">
      <BoxApproval />
      <div className="rejectBoxPopup">
        {/* <RejectBoxPopup /> */}
        {/* hello */}
      </div>
    </div>
  );
}

export default AdminDashboard;
