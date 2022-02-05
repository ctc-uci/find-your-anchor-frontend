import { React, useEffect, useState } from 'react';
import utils from '../../common/utils';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import './AdminDashboard.css';

function AdminDashboard() {
  const [relocationBoxes, setRelocationBoxes] = useState([]);
  const fetchRelocationBoxes = () => {
    utils.get('/relocationBoxes').then(response => {
      console.log(response);
      setRelocationBoxes(response.data);
    });
  };
  console.log(relocationBoxes);
  useEffect(() => fetchRelocationBoxes(), []);

  return (
    <div className="adminDashBoardDiv">
      <BoxApproval />
    </div>
  );
}

export default AdminDashboard;
