import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';

import Map from './components/Map/Map';
import ExportCSV from './components/ExportCSV/ExportCSV';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<Map />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<App />} />
        <Route path="/dropoff-form" element={<App />} />
        <Route path="/pickup-form" element={<App />} />
        <Route path="/export-csv" element={<ExportCSV />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
