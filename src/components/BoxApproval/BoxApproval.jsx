import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';
import utils from '../../common/utils';

// Box ID: int
// isApproved: boolean
// message: String
// currentLocation: (String, int) - (Irvine, 92627)
// pickup: boolean - (true == pickup box, false == relocation box)

function BoxApproval() {
  const [relocationBoxes, setRelocationBoxes] = useState([]);
  const fetchRelocationBoxes = () => {
    utils.get('/relocationBoxes').then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <RelocationBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            name={boxData.name}
            email={boxData.email}
            currentLocation={boxData.current_location}
            picture={boxData.picture}
            generalLocation={boxData.general_location}
            message={boxData.message}
          />
        );
      });
      setRelocationBoxes(allBoxData);
    });
  };
  useEffect(() => fetchRelocationBoxes(), []);

  const [pickupBoxes, setPickupBoxes] = useState([]);
  const fetchPickupBoxes = () => {
    utils.get('/pickupBoxes').then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <PickupBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            name={boxData.name}
            email={boxData.email}
            currentLocation={boxData.current_location}
            picture={boxData.picture}
          />
        );
      });
      // console.log(allBoxData);
      setPickupBoxes(allBoxData);
    });
  };
  useEffect(() => fetchPickupBoxes(), []);

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
                <div>{relocationBoxes}</div>
                <div>{pickupBoxes}</div>
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
