import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route path="/admin" element={<App />} />
        <Route path="/login" element={<App />} />
        <Route path="/dropoff-form" element={<App />} />
        <Route path="/pickup-form" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
