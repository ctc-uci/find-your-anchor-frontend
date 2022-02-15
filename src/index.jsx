import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UploadCSVTemp from './pages/UploadCSVTemp/UploadCSVTemp';
import Map from './components/Map/Map';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<Map />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<App />} />
        <Route path="/dropoff-form" element={<App />} />
        <Route path="/pickup-form" element={<App />} />
        <Route path="/upload-csv" element={<UploadCSVTemp />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
