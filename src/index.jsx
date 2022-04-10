import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ProtectedRoute from './common/ProtectedRoute';
import Layout from './components/Layout/Layout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminProfilePage from './pages/AdminProfilePage/AdminProfilePage';
import ExportCSV from './pages/ExportCSV/ExportCSV';
import CSVPreviewPage from './pages/CSVPreviewPage/CSVPreviewPage';

import AddBoxFormPage from './pages/AddBoxForm/AddBoxFormPage';
import AuthEmail from './components/AuthEmail/AuthEmail';
import PickupBoxFormPage from './pages/PickupBoxForm/PickupBoxFormPage';
import RelocateBoxFormPage from './pages/RelocateBoxForm/RelocateBoxFormPage';
import UploadCSVView from './pages/UploadCSVView/UploadCSVView';
import LoginPage from './pages/Login/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route element={<Layout isAdmin={false} />}>
            <Route path="/pickup-box-form" element={<PickupBoxFormPage />} />
            <Route path="/relocate-box-form" element={<RelocateBoxFormPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth-email" element={<AuthEmail redirectPath="/" />} />
          <Route path="/" element={<App />} />
          <Route element={<Layout isAdmin />}>
            <Route
              exact
              path="/profile"
              element={
                <ProtectedRoute path="/profile" Component={AdminProfilePage} redirectPath="/" />
              }
            />
            {/* <Route
              exact
              path="/admin"
              element={
                <ProtectedRoute path="/profile" Component={AdminDashboard} redirectPath="/" />
              }
            /> */}
            <Route
              exact
              path="/export-csv"
              element={<ProtectedRoute path="/profile" Component={ExportCSV} redirectPath="/" />}
            />
            <Route
              exact
              path="/export-csv-preview"
              element={
                <ProtectedRoute path="/profile" Component={CSVPreviewPage} redirectPath="/" />
              }
            />
            <Route
              exact
              path="/add-box-form"
              element={
                <ProtectedRoute path="/profile" Component={AddBoxFormPage} redirectPath="/" />
              }
            />
            <Route
              exact
              path="/upload-csv-view"
              element={
                <ProtectedRoute path="/profile" Component={UploadCSVView} redirectPath="/" />
              }
            />
          </Route>
        </Routes>
      </Router>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
