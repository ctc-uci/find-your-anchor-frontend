import React, { useState } from 'react';
import { Stack, Button } from '@chakra-ui/react';
import './BoxApproval.css';

function BoxApproval() {
  const [currentTab, setCurrentTab] = useState('requiresApproval');
  // eslint-disable-next-line no-unused-vars
  const [requiresApprovalBoxes, setRequiresApprovalBoxes] = useState(['box 1', 'box 2', 'box 3']);
  // eslint-disable-next-line no-unused-vars
  const [approvedDeniedBoxes, setApprovedDeniedBoxes] = useState(['box 1', 'box 2']);

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

      {currentTab === 'requiresApproval'
        ? requiresApprovalBoxes.map(box => <p key="">{box}</p>)
        : approvedDeniedBoxes.map(box => <p key="">{box}</p>)}
    </div>
  );
}

export default BoxApproval;
