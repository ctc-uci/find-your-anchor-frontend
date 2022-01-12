import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import Map from './components/Map/Map';
import AddBoxForm from './pages/AddBoxForm/AddBoxForm';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Map />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<App />} />
          <Route path="/dropoff-form" element={<App />} />
          <Route path="/pickup-form" element={<App />} />
          <Route path="/box" element={<AddBoxForm />} />
        </Routes>
      </Router>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
