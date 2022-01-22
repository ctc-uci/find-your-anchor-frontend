import React from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';

function BoxApproval() {
  return (
    <ChakraProvider>
      <div className="boxApproval">
        <Tabs align="center" variant="line">
          <div>
            <TabList>
              <Tab>Under Review</Tab>
              <Tab>Pending Changes</Tab>
              <Tab>Evaluated</Tab>
            </TabList>
          </div>
          <div className="boxList">
            <TabPanels>
              <TabPanel>
                <PickupBox />
                <RelocationBox />
              </TabPanel>
              <TabPanel>
                <PickupBox />
                <PickupBox />
              </TabPanel>
              <TabPanel>
                <PickupBox />
              </TabPanel>
            </TabPanels>
          </div>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}

export default BoxApproval;
