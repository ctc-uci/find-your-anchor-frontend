import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import styles from './BoxApproval.module.css';
import { FYABackend } from '../../common/utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import PickupBoxIcon from '../BoxIcons/PickupBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';

const BoxApproval = ({ toast }) => {
  BoxApproval.propTypes = {
    toast: PropTypes.func.isRequired,
  };
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

  // Gets all Relocation/Pickup boxes according to status
  const fetchBoxes = async (status, pickup) => {
    const response = await FYABackend.get('/boxHistory', {
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

  // Maps a single box to a RelocationBox component
  const mapDataToRelocationBox = boxData => (
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
      launchedOrganically={boxData.launched_organically}
      toast={toast}
    />
  );

  // Maps a single box to a PickupBox component
  const mapDataToPickupBox = boxData => (
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
      rejectionReason={boxData.rejection_reason}
      pickup={boxData.pickup}
      fetchBoxes={fetchBoxes}
    />
  );

  // Loads all boxes under a certain status
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
      <div className={styles['box-approval']}>
        <Tabs align="center" variant="line">
          <div>
            <TabList>
              <Tab onClick={() => loadBoxesUnderStatus('under review')}>Under Review</Tab>
              <Tab onClick={() => loadBoxesUnderStatus('pending changes')}>Pending Changes</Tab>
              <Tab onClick={() => loadBoxesUnderStatus('evaluated')}>Evaluated</Tab>
            </TabList>
          </div>
          <div className={styles['box-list']}>
            <TabPanels>
              {/* 'Under Review' section */}
              <TabPanel>
                <div>
                  {relocationBoxesUnderReview.map(boxData => mapDataToRelocationBox(boxData))}
                </div>
                <div>{pickupBoxesUnderReview.map(boxData => mapDataToPickupBox(boxData))}</div>
              </TabPanel>
              {/* 'Pending Changes' section */}
              <TabPanel>
                <div>{relocationBoxesPending.map(boxData => mapDataToRelocationBox(boxData))} </div>
              </TabPanel>
              {/* 'Evaluated' section */}
              <TabPanel>
                <div>
                  {relocationBoxesEvaluated.map(boxData => mapDataToRelocationBox(boxData))}
                </div>
                <div>
                  {pickupBoxesEvaluated.map(boxData => mapDataToPickupBox(boxData))}
                  <RejectBoxPopup />
                  <RequestChangesPopup />
                </div>
              </TabPanel>
            </TabPanels>
          </div>
        </Tabs>
        <div className={styles.legend}>
          <div className={styles['request-changes-row']}>
            <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
            <p className={styles['request-changes-text']}>Request Changes</p>
          </div>
          <div className={styles['relocate-box-row']}>
            <img className={styles['relocate-box-icon']} src={RelocateBoxIcon} alt="" />
            <p className={styles['relocate-box-text']}>Relocated</p>
          </div>
          <div className={styles['pickup-box-row']}>
            <img className={styles['pickup-box-icon']} src={PickupBoxIcon} alt="" />
            <p className={styles['pickup-box-text']}>Picked Up</p>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
