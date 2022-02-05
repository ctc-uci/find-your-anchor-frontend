import React from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';

// Box ID: int
// isApproved: boolean
// message: String
// currentLocation: (String, int) - (Irvine, 92627)
// pickup: boolean - (true == pickup box, false == relocation box)

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
              {/* 'Under Review' section */}
              <TabPanel>
                <PickupBox />
                <RelocationBox />
              </TabPanel>
              {/* 'Pending Changes' section */}
              <TabPanel>
                <PickupBox />
                <PickupBox />
              </TabPanel>
              {/* 'Evaluated' section */}
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
