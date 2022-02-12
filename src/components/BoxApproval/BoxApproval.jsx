import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';

import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';
import FYABackend from '../../common/utils';

// Box ID: int
// isApproved: boolean
// message: String
// currentLocation: (String, int) - (Irvine, 92627)
// pickup: boolean - (true == pickup box, false == relocation box)

const BoxApproval = () => {
  // display relocation boxes under review
  const [relocationBoxesUnderReview, setRelocationBoxesUnderReview] = useState([]);
  const fetchRelocationBoxesUnderReview = () => {
    FYABackend.get('/box/getBoxes', {
      params: {
        status: 'under review',
        pickup: false,
      },
    }).then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <RelocationBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            boxHolderName={boxData.boxholder_name}
            boxHolderEmail={boxData.boxholder_email}
            zipCode={boxData.zip_code}
            picture={boxData.picture}
            generalLocation={boxData.general_location}
            message={boxData.message}
            date={boxData.date}
          />
        );
      });
      setRelocationBoxesUnderReview(allBoxData);
    });
  };
  useEffect(() => fetchRelocationBoxesUnderReview(), []);

  // display relocation boxes evaluated
  const [relocationBoxesEvaluated, setRelocationBoxesEvaluated] = useState([]);
  const fetchRelocationBoxesEvaluated = () => {
    FYABackend.get('/box/getBoxes', {
      params: {
        status: 'evaluated',
        pickup: false,
      },
    }).then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <RelocationBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            boxHolderName={boxData.boxholder_name}
            boxHolderEmail={boxData.boxholder_email}
            zipCode={boxData.zip_code}
            picture={boxData.picture}
            generalLocation={boxData.general_location}
            message={boxData.message}
            date={boxData.date}
          />
        );
      });
      setRelocationBoxesEvaluated(allBoxData);
    });
  };
  useEffect(() => fetchRelocationBoxesEvaluated(), []);

  // a pickup box will never be pending
  // display relocation boxes pending
  const [relocationBoxesPending, setRelocationBoxesPending] = useState([]);
  const fetchRelocationBoxesPending = () => {
    FYABackend.get('/box/getBoxes', {
      params: {
        status: 'pending changes',
        pickup: false,
      },
    }).then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <RelocationBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            boxHolderName={boxData.boxholder_name}
            boxHolderEmail={boxData.boxholder_email}
            zipCode={boxData.zip_code}
            picture={boxData.picture}
            generalLocation={boxData.general_location}
            message={boxData.message}
            date={boxData.date}
          />
        );
      });
      setRelocationBoxesPending(allBoxData);
    });
  };
  useEffect(() => fetchRelocationBoxesPending(), []);

  // display pickup boxes evaluated
  const [pickupBoxesEvaluated, setPickupBoxesEvaluated] = useState([]);
  const fetchPickupBoxesEvaluated = () => {
    FYABackend.get('/box/getBoxes', {
      params: {
        status: 'evaluated',
        pickup: true,
      },
    }).then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <PickupBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            boxHolderName={boxData.boxholder_name}
            boxHolderEmail={boxData.boxholder_email}
            zipCode={boxData.zip_code}
            picture={boxData.picture}
          />
        );
      });
      setPickupBoxesEvaluated(allBoxData);
    });
  };
  useEffect(() => fetchPickupBoxesEvaluated(), []);

  // display pickup boxes under review
  const [pickupBoxesUnderReview, setPickupBoxesUnderReview] = useState([]);
  const fetchPickupBoxesUnderReview = () => {
    FYABackend.get('/box/getBoxes', {
      params: {
        status: 'under review',
        pickup: true,
      },
    }).then(response => {
      const allBoxData = response.data.rows.map(boxData => {
        return (
          <PickupBox
            key={boxData.box_id}
            boxID={boxData.box_id}
            boxHolderName={boxData.boxholder_name}
            boxHolderEmail={boxData.boxholder_email}
            zipCode={boxData.zip_code}
            picture={boxData.picture}
            date={boxData.date}
          />
        );
      });
      setPickupBoxesUnderReview(allBoxData);
    });
  };
  useEffect(() => fetchPickupBoxesUnderReview(), []);

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
                <div>{relocationBoxesUnderReview}</div>
                <div>{pickupBoxesUnderReview}</div>
              </TabPanel>
              {/* 'Pending Changes' section */}
              <TabPanel>
                <div>{relocationBoxesPending}</div>
              </TabPanel>
              {/* 'Evaluated' section */}
              <TabPanel>
                <div>{relocationBoxesEvaluated}</div>
                <div>{pickupBoxesEvaluated}</div>
              </TabPanel>
            </TabPanels>
          </div>
        </Tabs>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
