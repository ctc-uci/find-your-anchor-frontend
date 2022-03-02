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
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import AuthEmail from './components/AuthEmail/AuthEmail';
import AdminInvite from './components/AuthEmail/AdminInvite';

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth-email" element={<AuthEmail redirectPath="/" />} />
          <Route
            path="/admin-invite"
            element={
              <ProtectedRoute path="/admin-invite" Component={AdminInvite} redirectPath="/" />
            }
          />

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
