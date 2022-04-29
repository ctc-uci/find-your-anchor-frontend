import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import styles from './BoxApproval.module.css';
import { FYABackend } from '../../common/utils';
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';
import RelocateBoxIcon from '../../assets/BoxIcons/RelocateBoxIcon.svg';
import usePaginationController from '../../common/usePaginationController';
import PaginationController from '../../common/CommonPaginationController/PaginationController';

const BoxApproval = () => {
  const [boxesUnderReview, setBoxesUnderReview] = useState([]);
  const [boxesPending, setBoxesPending] = useState([]);
  const [boxesEvaluated, setBoxesEvaluated] = useState([]);

  const [
    paginatedUnderReviewData,
    paginatedUnderReviewIndex,
    setPaginatedUnderReviewIndex,
    totalNumberOfUnderReviewPages,
  ] = usePaginationController(boxesUnderReview);

  const [
    paginatedPendingData,
    paginatedPendingIndex,
    setPaginatedPendingIndex,
    totalNumberOfPendingPages,
  ] = usePaginationController(boxesPending);

  const [
    paginatedEvaluatedData,
    paginatedEvaluatedIndex,
    setPaginatedEvaluatedIndex,
    totalNumberOfEvaluatedPages,
  ] = usePaginationController(boxesEvaluated);

  // Gets all Relocation/Pickup boxes according to status
  const fetchBoxes = async status => {
    const response = await FYABackend.get('/boxHistory', {
      params: {
        status,
      },
    });
    if (status === 'under review') {
      setBoxesUnderReview(response.data);
    } else if (status === 'pending changes') {
      setBoxesPending(response.data);
    } else {
      setBoxesEvaluated(response.data);
    }
  };

  // Maps a single box to a RelocationBox component
  const mapDataToBox = boxData =>
    boxData.pickup ? (
      <PickupBox
        transactionID={boxData.transaction_id}
        key={boxData.transaction_id}
        boxID={boxData.box_id}
        boxHolderName={boxData.boxholder_name}
        boxHolderEmail={boxData.boxholder_email}
        zipCode={boxData.zip_code}
        country={boxData.country}
        picture={boxData.picture}
        date={boxData.date}
        status={boxData.status}
        approved={boxData.approved}
        rejectionReason={boxData.rejection_reason}
        pickup={boxData.pickup}
        fetchBoxes={fetchBoxes}
        imageStatus={boxData.image_status}
        admin={boxData.admin}
      />
    ) : (
      <RelocationBox
        key={boxData.transaction_id}
        transactionID={boxData.transaction_id}
        boxID={boxData.box_id}
        boxHolderName={boxData.boxholder_name}
        boxHolderEmail={boxData.boxholder_email}
        zipCode={boxData.zip_code}
        boxCountry={boxData.country}
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
        imageStatus={boxData.image_status}
        admin={boxData.admin}
      />
    );

  // Gets all boxes on page load
  useEffect(async () => {
    await fetchBoxes('under review');
  }, []);

  return (
    <ChakraProvider>
      <div className={styles['box-approval']}>
        <Tabs align="center" variant="line">
          <div>
            <TabList>
              <Tab onClick={async () => fetchBoxes('under review')}>Under Review</Tab>
              <Tab onClick={async () => fetchBoxes('pending changes')}>Pending Changes</Tab>
              <Tab onClick={async () => fetchBoxes('evaluated')}>Evaluated</Tab>
            </TabList>
          </div>
          <div className={styles['box-list']}>
            <TabPanels>
              {/* 'Under Review' section */}
              <TabPanel>{paginatedUnderReviewData.map(boxData => mapDataToBox(boxData))}</TabPanel>
              {/* 'Pending Changes' section */}
              <TabPanel>{paginatedPendingData.map(boxData => mapDataToBox(boxData))}</TabPanel>
              {/* 'Evaluated' section */}
              <TabPanel>{paginatedEvaluatedData.map(boxData => mapDataToBox(boxData))}</TabPanel>
            </TabPanels>
          </div>
        </Tabs>
        <div className={styles.legend}>
          <PaginationController
            paginatedIndex={paginatedUnderReviewIndex}
            setPaginatedIndex={setPaginatedUnderReviewIndex}
            totalNumberOfPages={totalNumberOfUnderReviewPages}
          />
          <PaginationController
            paginatedIndex={paginatedPendingIndex}
            setPaginatedIndex={setPaginatedPendingIndex}
            totalNumberOfPages={totalNumberOfPendingPages}
          />
          <PaginationController
            paginatedIndex={paginatedEvaluatedIndex}
            setPaginatedIndex={setPaginatedEvaluatedIndex}
            totalNumberOfPages={totalNumberOfEvaluatedPages}
          />
          <div className={styles['request-changes-row']}>
            <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
            <p className={styles['request-changes-text']}>Request Changes</p>
          </div>
          <div className={styles['relocate-box-row']}>
            <img className={styles['relocate-box-icon']} src={RelocateBoxIcon} alt="" />
            <p className={styles['relocate-box-text']}>Launched</p>
          </div>
          <div className={styles['pickup-box-row']}>
            <img className={styles['pickup-box-icon']} src={PickupBoxIcon} alt="" />
            <p className={styles['pickup-box-text']}>Found a Box</p>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
