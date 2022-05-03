import { React, useEffect, useState } from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import styles from './BoxApproval.module.css';
import { FYABackend } from '../../common/utils';
import RelocateBoxIcon from '../../assets/BoxIcons/RelocateBoxIcon.svg';
import usePaginationController from '../../common/usePaginationController';
import PaginationController from '../../common/CommonPaginationController/PaginationController';
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';

const BoxApproval = () => {
  const [boxesUnderReview, setBoxesUnderReview] = useState([]);
  const [boxesPending, setBoxesPending] = useState([]);
  const [boxesEvaluated, setBoxesEvaluated] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('under review');

  const [
    paginatedUnderReviewData,
    paginatedUnderReviewIndex,
    setPaginatedUnderReviewIndex,
    totalNumberOfUnderReviewPages,
  ] = usePaginationController(boxesUnderReview, 8);

  const [
    paginatedPendingData,
    paginatedPendingIndex,
    setPaginatedPendingIndex,
    totalNumberOfPendingPages,
  ] = usePaginationController(boxesPending, 8);

  const [
    paginatedEvaluatedData,
    paginatedEvaluatedIndex,
    setPaginatedEvaluatedIndex,
    totalNumberOfEvaluatedPages,
  ] = usePaginationController(boxesEvaluated, 8);

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
        verificationPicture={boxData.verification_picture}
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
        verificationPicture={boxData.verification_picture}
      />
    );

  // Gets all boxes on page load
  useEffect(async () => {
    await fetchBoxes('under review');
  }, []);

  const handleTabClicked = status => {
    fetchBoxes(status);
    setCurrentStatus(status);
  };

  return (
    <ChakraProvider>
      <div className={styles['box-approval']}>
        <Tabs align="center" variant="line" className={styles['tab-wrapper']} isLazy>
          <TabList>
            <Tab onClick={() => handleTabClicked('under review')}>Under Review</Tab>
            <Tab onClick={() => handleTabClicked('pending changes')}>Pending Changes</Tab>
            <Tab onClick={() => handleTabClicked('evaluated')}>Evaluated</Tab>
          </TabList>
          <div className={styles['box-list-and-pagination']}>
            <div className={styles['box-list']}>
              <TabPanels>
                {/* 'Under Review' section */}
                <TabPanel className={styles['tab-panel']}>
                  {paginatedUnderReviewData.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
                {/* 'Pending Changes' section */}
                <TabPanel className={styles['tab-panel']}>
                  {paginatedPendingData.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
                {/* 'Evaluated' section */}
                <TabPanel className={styles['tab-panel']}>
                  {paginatedEvaluatedData.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
              </TabPanels>
            </div>

            {currentStatus === 'under review' && (
              <PaginationController
                paginatedIndex={paginatedUnderReviewIndex}
                setPaginatedIndex={setPaginatedUnderReviewIndex}
                totalNumberOfPages={totalNumberOfUnderReviewPages}
              />
            )}
            {currentStatus === 'pending changes' && (
              <PaginationController
                paginatedIndex={paginatedPendingIndex}
                setPaginatedIndex={setPaginatedPendingIndex}
                totalNumberOfPages={totalNumberOfPendingPages}
              />
            )}
            {currentStatus === 'evaluated' && (
              <PaginationController
                paginatedIndex={paginatedEvaluatedIndex}
                setPaginatedIndex={setPaginatedEvaluatedIndex}
                totalNumberOfPages={totalNumberOfEvaluatedPages}
              />
            )}
            <div className={styles.legend}>
              <div className={styles['legend-row']}>
                <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
                <p className={styles['request-changes-text']}>Request Changes</p>
              </div>
              <div className={styles['legend-row']}>
                <img className={styles['relocate-box-icon']} src={RelocateBoxIcon} alt="" />
                <p className={styles['relocate-box-text']}>Launched</p>
              </div>
              <div className={styles['legend-row']}>
                <img className={styles['pickup-box-icon']} src={PickupBoxIcon} alt="" />
                <p className={styles['pickup-box-text']}>Found a Box</p>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </ChakraProvider>
  );
};

export default BoxApproval;
