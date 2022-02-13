import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';
import FYABackend from '../../common/utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
// Box ID: int
// isApproved: boolean
// message: String
// currentLocation: (String, int) - (Irvine, 92627)
// pickup: boolean - (true == pickup box, false == relocation box)

const BoxApproval = () => {
  // display relocation boxes under review
  const [relocationBoxesUnderReview, setRelocationBoxesUnderReview] = useState([]);
  // display relocation boxes evaluated
  const [relocationBoxesEvaluated, setRelocationBoxesEvaluated] = useState([]);
  // display relocation boxes pending
  const [relocationBoxesPending, setRelocationBoxesPending] = useState([]);
  // display pickup boxes under review
  const [pickupBoxesUnderReview, setPickupBoxesUnderReview] = useState([]);
  // display pickup boxes evaluated
  const [pickupBoxesEvaluated, setPickupBoxesEvaluated] = useState([]);

  /**
   * Gets all Relocation/Pickup boxes according to status
   */
  const fetchBoxes = async (status, pickup) => {
    const response = await FYABackend.get('/box/getBoxes', {
      params: {
        status,
        pickup,
      },
    });
    return response.data.rows;
  };

  // Gets relocation boxes under review
  const populateRelocationBoxesUnderReview = () => {
    fetchBoxes('under review', false).then(response => {
      setRelocationBoxesUnderReview(response);
    });
  };

  // Gets relocation boxes that have been evaluated
  const populateRelocationBoxesEvaluated = () => {
    fetchBoxes('evaluated', false).then(response => {
      setRelocationBoxesEvaluated(response);
    });
  };

  // aGets relocation boxes that are pending changes
  const populateRelocationBoxesPending = () => {
    fetchBoxes('pending changes', false).then(response => {
      setRelocationBoxesPending(response);
    });
  };

  // Gets pickup boxes that have been evaluated
  const populatePickupBoxesEvaluated = () => {
    fetchBoxes('evaluated', true).then(response => {
      setPickupBoxesEvaluated(response);
    });
  };

  // Gets pickup boxes under review
  const populatePickupBoxesUnderReview = () => {
    fetchBoxes('under review', true).then(response => {
      setPickupBoxesUnderReview(response);
    });
  };

  // Gets all boxes on page load
  useEffect(() => {
    populateRelocationBoxesUnderReview();
    populateRelocationBoxesEvaluated();
    populateRelocationBoxesPending();
    populatePickupBoxesEvaluated();
    populatePickupBoxesUnderReview();
  }, []);

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
                <div>
                  {relocationBoxesUnderReview.map(boxData => (
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
                      setRelocationBoxesUnderReview={setRelocationBoxesUnderReview}
                      setRelocationBoxesEvaluated={setRelocationBoxesEvaluated}
                      setRelocationBoxesPending={setRelocationBoxesPending}
                      fetchBoxes={fetchBoxes}
                    />
                  ))}
                </div>
                <div>
                  {pickupBoxesUnderReview.map(boxData => (
                    <PickupBox
                      key={boxData.box_id}
                      boxID={boxData.box_id}
                      boxHolderName={boxData.boxholder_name}
                      boxHolderEmail={boxData.boxholder_email}
                      zipCode={boxData.zip_code}
                      picture={boxData.picture}
                      date={boxData.date}
                      setPickupBoxesEvaluated={setPickupBoxesEvaluated}
                      setPickupBoxesUnderReview={setPickupBoxesUnderReview}
                      fetchBoxes={fetchBoxes}
                    />
                  ))}
                </div>
              </TabPanel>
              {/* 'Pending Changes' section */}
              <TabPanel>
                <div>
                  {relocationBoxesPending.map(boxData => (
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
                      setRelocationBoxesUnderReview={setRelocationBoxesUnderReview}
                      setRelocationBoxesEvaluated={setRelocationBoxesEvaluated}
                      setRelocationBoxesPending={setRelocationBoxesPending}
                      fetchBoxes={fetchBoxes}
                    />
                  ))}
                </div>
              </TabPanel>
              {/* 'Evaluated' section */}
              <TabPanel>
                <div>
                  {relocationBoxesEvaluated.map(boxData => (
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
                      setRelocationBoxesUnderReview={setRelocationBoxesUnderReview}
                      setRelocationBoxesEvaluated={setRelocationBoxesEvaluated}
                      setRelocationBoxesPending={setRelocationBoxesPending}
                      fetchBoxes={fetchBoxes}
                    />
                  ))}
                </div>
                <div>
                  {pickupBoxesEvaluated.map(boxData => (
                    <PickupBox
                      key={boxData.box_id}
                      boxID={boxData.box_id}
                      boxHolderName={boxData.boxholder_name}
                      boxHolderEmail={boxData.boxholder_email}
                      zipCode={boxData.zip_code}
                      picture={boxData.picture}
                      date={boxData.date}
                      setPickupBoxesEvaluated={setPickupBoxesEvaluated}
                      setPickupBoxesUnderReview={setPickupBoxesUnderReview}
                      fetchBoxes={fetchBoxes}
                    />
                  ))}
                  <RejectBoxPopup />
                  <RequestChangesPopup />
                </div>
              </TabPanel>
            </TabPanels>
          </div>
        </Tabs>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
