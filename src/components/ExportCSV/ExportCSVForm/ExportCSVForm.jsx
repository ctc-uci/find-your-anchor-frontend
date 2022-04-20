import React from 'react';
import useMobileWidth from '../../../common/FormUtils/useMobileWidth';

import ExportCSVFormDesktop from './ExportCSVFormDesktop';
import ExportCSVFormMobile from './ExportCSVFormMobile';

const ExportCSVForm = () => {
  const isMobile = useMobileWidth();

  return <>{isMobile ? <ExportCSVFormMobile /> : <ExportCSVFormDesktop />}</>;
};
export default ExportCSVForm;
