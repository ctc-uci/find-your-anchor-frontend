import React from 'react';
import { useLocation } from 'react-router-dom';

const CSVPreview = () => {
  const { state } = useLocation();
  console.log('STATE FROM CSV PREVIEW:', state);
  return <div>CSVPreview</div>;
};

export default CSVPreview;
