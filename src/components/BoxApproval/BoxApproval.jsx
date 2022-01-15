import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Box from '../Box/Box';
import './BoxApproval.css';

function BoxApproval() {
  // const [currentTab, setCurrentTab] = useState('underReview');
  // eslint-disable-next-line no-unused-vars
  const [underReviewBoxes, setunderReviewBoxes] = useState([Box(), Box(), Box()]);
  // eslint-disable-next-line no-unused-vars
  const [previouslyReviewedBoxes, setpreviouslyReviewedBoxes] = useState([Box(), Box()]);

  return (
    <div className="boxApproval">
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Under Review</Tab>
          <Tab>Pending Changes</Tab>
          <Tab>Evaluated</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box />
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default BoxApproval;
