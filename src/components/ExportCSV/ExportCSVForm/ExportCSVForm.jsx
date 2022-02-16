import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@chakra-ui/react';

const ExportCSVForm = ({ setFormValues }) => {
  const onSubmit = () => setFormValues([]);

  return (
    <div>
      <p>Export CSV Form</p>
      <Button onClick={onSubmit}>Sample Button</Button>
    </div>
  );
};

ExportCSVForm.propTypes = {
  setFormValues: PropTypes.func.isRequired,
};

export default ExportCSVForm;
