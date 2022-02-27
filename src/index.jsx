import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UploadCSVView from './pages/UploadCSVView/UploadCSVView';
import ExportCSV from './pages/ExportCSV/ExportCSV';

import Map from './components/Map/Map';
import AddBoxFormPage from './pages/AddBoxForm/AddBoxFormPage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<Map />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<App />} />
        <Route path="/dropoff-form" element={<App />} />
        <Route path="/pickup-form" element={<App />} />
        <Route path="/upload-csv-view" element={<UploadCSVView />} />
        <Route path="/export-csv" element={<ExportCSV />} />
        <Route path="/add-box-form" element={<AddBoxFormPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
