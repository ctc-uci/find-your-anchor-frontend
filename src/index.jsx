import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Layout from './components/Layout/Layout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ExportCSV from './pages/ExportCSV/ExportCSV';

import Map from './components/Map/Map';
import AddBoxFormPage from './pages/AddBoxForm/AddBoxFormPage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<App />} />
        <Layout>
          <Route exact path="/" element={<Map />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dropoff-form" element={<App />} />
          <Route path="/pickup-form" element={<App />} />
          <Route path="/export-csv" element={<ExportCSV />} />
          <Route path="/add-box-form" element={<AddBoxFormPage />} />
        </Layout>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
