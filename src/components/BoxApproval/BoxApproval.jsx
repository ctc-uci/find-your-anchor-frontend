import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import './BoxApproval.css';
import FYABackend from '../../common/utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import RequestChangesMiniIcon from '../BoxIcons/RequestChangesMiniIcon.svg';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';

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
    if (status === 'under review' && !pickup) {
      setRelocationBoxesUnderReview(response.data);
    } else if (status === 'evaluated' && !pickup) {
      setRelocationBoxesEvaluated(response.data);
    } else if (status === 'pending changes' && !pickup) {
      setRelocationBoxesPending(response.data);
    } else if (status === 'under review' && pickup) {
      setPickupBoxesUnderReview(response.data);
    } else {
      setPickupBoxesEvaluated(response.data);
    }
  };

  const loadBoxesUnderStatus = async status => {
    const requests = [fetchBoxes(status, false), fetchBoxes(status, true)];
    await Promise.all(requests);
  };

  // Gets all boxes on page load
  useEffect(() => {
    loadBoxesUnderStatus('under review');
  }, []);

  return (
    <ChakraProvider>
      <div className="boxApproval">
        <Tabs align="center" variant="line">
          <div>
            <TabList>
              <Tab onClick={() => loadBoxesUnderStatus('under review')}>Under Review</Tab>
              <Tab onClick={() => loadBoxesUnderStatus('pending changes')}>Pending Changes</Tab>
              <Tab onClick={() => loadBoxesUnderStatus('evaluated')}>Evaluated</Tab>
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
                      status={boxData.status}
                      approved={boxData.approved}
                      changesRequested={boxData.changes_requested}
                      rejectionReason={boxData.rejection_reason}
                      messageStatus={boxData.message_status}
                      fetchBoxes={fetchBoxes}
                      pickup={boxData.pickup}
                      dropOffMethod={boxData.drop_off_method}
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
                      status={boxData.status}
                      approved={boxData.approved}
                      pickup={boxData.pickup}
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
                      status={boxData.status}
                      approved={boxData.approved}
                      changesRequested={boxData.changes_requested}
                      rejectionReason={boxData.rejection_reason}
                      messageStatus={boxData.message_status}
                      fetchBoxes={fetchBoxes}
                      pickup={boxData.pickup}
                      dropOffMethod={boxData.drop_off_method}
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
                      status={boxData.status}
                      approved={boxData.approved}
                      changesRequested={boxData.changes_requested}
                      rejectionReason={boxData.rejection_reason}
                      messageStatus={boxData.message_status}
                      fetchBoxes={fetchBoxes}
                      pickup={boxData.pickup}
                      dropOffMethod={boxData.drop_off_method}
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
                      status={boxData.status}
                      approved={boxData.approved}
                      pickup={boxData.pickup}
                      rejectionReason={boxData.rejection_reason}
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
        <div className="legend">
          <div className="request-changes-row">
            <img className="request-changes-icon" src={RequestChangesMiniIcon} alt="" />
            <p className="request-changes-text">Request Changes</p>
          </div>
          <div className="relocate-box-row">
            <img className="relocate-box-icon" src={RelocateBoxIcon} alt="" />
            <p className="relocate-box-text">Relocated</p>
          </div>
          <div className="pickup-box-row">
            <img className="pickup-box-icon" src={PickupBoxIcon} alt="" />
            <p className="pickup-box-text">Picked Up</p>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
