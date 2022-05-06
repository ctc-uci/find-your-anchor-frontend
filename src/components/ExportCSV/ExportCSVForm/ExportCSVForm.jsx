import React from 'react';
import PropTypes from 'prop-types';
import useMobileWidth from '../../../common/useMobileWidth';
import ExportCSVFormDesktop from './ExportCSVFormDesktop';
import ExportCSVFormMobile from './ExportCSVFormMobile';

const ExportCSVForm = ({ formID }) => {
  const isMobile = useMobileWidth();

  return (
    <>
      {isMobile ? (
        <ExportCSVFormMobile formID={formID} />
      ) : (
        <ExportCSVFormDesktop formID={formID} />
      )}
    </>
  );
};

ExportCSVForm.propTypes = {
  formID: PropTypes.string.isRequired,
};

export default ExportCSVForm;
