import React, { useState } from 'react';
import { Stack, Button } from '@chakra-ui/react';
import Box from './Box';
import './BoxApproval.css';

function BoxApproval() {
  const [currentTab, setCurrentTab] = useState('requiresApproval');
  // eslint-disable-next-line no-unused-vars
  const [requiresApprovalBoxes, setRequiresApprovalBoxes] = useState([Box(), Box(), Box()]);
  // eslint-disable-next-line no-unused-vars
  const [approvedDeniedBoxes, setApprovedDeniedBoxes] = useState([Box(), Box()]);

  return (
    <div className="boxApproval">
      <h1 className="boxApprovalHeading">Box Approval</h1>
      <div className="boxApprovalMenu">
        <Stack spacing={0} direction="row" align="center" className="buttonStack">
          <Button
            onClick={() => setCurrentTab('requiresApproval')}
            size="xs"
            border="none"
            width="100%"
            className={`button-${currentTab === 'requiresApproval'}`}
          >
            <p className="buttonText">requires approval</p>
          </Button>
          <Button
            onClick={() => setCurrentTab('approvedDenied')}
            size="xs"
            border="none"
            width="100%"
            className={`button-${currentTab === 'approvedDenied'}`}
          >
            <p className="buttonText">approved/denied</p>
          </Button>
        </Stack>
      </div>

      {currentTab === 'requiresApproval' ? requiresApprovalBoxes : approvedDeniedBoxes}
    </div>
  );
}

export default BoxApproval;
