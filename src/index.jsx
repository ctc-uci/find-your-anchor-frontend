import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { ChakraProvider } from '@chakra-ui/provider';
import ReactDOM from 'react-dom';
import './index.css';
import ProtectedRoute from './common/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
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
import AboutPage from './pages/About/AboutPage';
import ChakraTheme from './common/ChakraTheme';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ChakraProvider theme={ChakraTheme}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/found-box-form" element={<PickupBoxFormPage />} />
              <Route path="/launch-box-form" element={<RelocateBoxFormPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth-email" element={<AuthEmail redirectPath="/" />} />
            <Route path="/" element={<Dashboard />} />

            <Route element={<Layout isAdmin />}>
              <Route
                exact
                path="/profile"
                element={<ProtectedRoute Component={AdminProfilePage} redirectPath="/login" />}
              />
              <Route
                exact
                path="/export-csv"
                element={<ProtectedRoute Component={ExportCSV} redirectPath="/login" />}
              />
              <Route
                exact
                path="/export-csv-preview"
                element={<ProtectedRoute Component={CSVPreviewPage} redirectPath="/login" />}
              />
              <Route
                exact
                path="/add-box-form"
                element={<ProtectedRoute Component={AddBoxFormPage} redirectPath="/login" />}
              />
              <Route
                exact
                path="/upload-csv-view"
                element={<ProtectedRoute Component={UploadCSVView} redirectPath="/login" />}
              />
            </Route>
          </Routes>
        </Router>
      </ChakraProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
