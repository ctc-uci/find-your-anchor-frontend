import React from 'react';
import axios from 'axios';
import BoxApproval from '../../components/BoxApproval/BoxApproval';
import './AdminDashboard.css';

function AdminDashboard() {
  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/")
  //   .then((res) => res.json())
  //   .then((data) => setData(data.message));
  // }, []);

  const FYABackend = axios.create({ baseURL: 'http://localhost:3001', withCredentials: true });
  console.log('hello');
  console.log(FYABackend);

  return (
    <div className="adminDashBoardDiv">
      <BoxApproval />
    </div>
  );
}

export default AdminDashboard;
