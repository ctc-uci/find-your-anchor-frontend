import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ProtectedRoute from './common/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ExportCSV from './pages/ExportCSV/ExportCSV';

import Map from './components/Map/Map';
import AddBoxFormPage from './pages/AddBoxForm/AddBoxFormPage';
import Login from './components/Login/Login';
import Logout from './components/Login/Logout';
import Register from './components/Register/Register';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Map />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/login" element={<Login />} />
          <Route
            exact
            path="/logout"
            element={<ProtectedRoute path="/logout" Component={Logout} redirectPath="/" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<App />} />
          <Route path="/emailAction" element={<App />} />
          <Route path="/adminInvite" element={<App />} />

          <Route path="/dropoff-form" element={<App />} />
          <Route path="/pickup-form" element={<App />} />
          <Route path="/export-csv" element={<ExportCSV />} />
          <Route path="/add-box-form" element={<AddBoxFormPage />} />
        </Routes>
      </Router>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
