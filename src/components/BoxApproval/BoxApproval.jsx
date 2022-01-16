import React, { useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Box from '../Box/Box';
import './BoxApproval.css';

function BoxApproval() {
  // const [currentTab, setCurrentTab] = useState('underReview');
  // eslint-disable-next-line no-unused-vars
  const [underReviewBoxes, setunderReviewBoxes] = useState([Box(), Box(), Box()]);
  // eslint-disable-next-line no-unused-vars
  const [previouslyReviewedBoxes, setpreviouslyReviewedBoxes] = useState([Box(), Box()]);

  return (
    <ChakraProvider>
      <div className="boxApproval">
        <Tabs align="center" variant="line">
          <TabList>
            <Tab>Under Review</Tab>
            <Tab>Pending Changes</Tab>
            <Tab>Evaluated</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box />
              <Box />
            </TabPanel>
            <TabPanel>
              <Box />
            </TabPanel>
            <TabPanel>
              <Box />
              <Box />
              <Box />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}

export default BoxApproval;
