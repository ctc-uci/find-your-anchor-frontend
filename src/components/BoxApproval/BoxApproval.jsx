import { React, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import PickupBox from '../PickupBox/PickupBox';
import RelocationBox from '../RelocationBox/RelocationBox';
import styles from './BoxApproval.module.css';
import { FYABackend } from '../../common/utils';
import RelocateBoxIcon from '../../assets/BoxIcons/RelocateBoxIcon.svg';
import PaginationController from '../../common/CommonPaginationController/PaginationController';
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';

const BoxApproval = ({ setZipCodeData }) => {
  const [boxesUnderReview, setBoxesUnderReview] = useState([]);
  // Page number for under review tab
  const [underReviewPageIndex, setUnderReviewPageIndex] = useState(1);
  const [boxesPending, setBoxesPending] = useState([]);
  // Page number for pending changes tab
  const [pendingPageIndex, setPendingPageIndex] = useState(1);
  const [boxesEvaluated, setBoxesEvaluated] = useState([]);
  // Page number for evaluated tab
  const [evaluatedPageIndex, setEvaluatedPageIndex] = useState(1);
  const [currentStatus, setCurrentStatus] = useState('under review');
  // Total number of pages for pagination
  const [numPages, setNumPages] = useState(1);

  // Page size to be used with pagination
  const PAGE_SIZE = 8;

  const reloadMap = async () => {
    const zipCodes = await FYABackend.get('/anchorBox/locations');
    setZipCodeData(zipCodes.data);
  };

  // Gets pagesize number of relocation/pickup boxes for a certain status
  const fetchBoxes = async status => {
    let pageIndex = null;
    if (status === 'under review') {
      pageIndex = underReviewPageIndex;
    } else if (status === 'pending changes') {
      pageIndex = pendingPageIndex;
    } else {
      pageIndex = evaluatedPageIndex;
    }
    const response = await FYABackend.get('/boxHistory', {
      params: {
        status,
        pageIndex,
        pageSize: PAGE_SIZE,
      },
    });
    if (status === 'under review') {
      setBoxesUnderReview(response.data);
    } else if (status === 'pending changes') {
      setBoxesPending(response.data);
    } else {
      setBoxesEvaluated(response.data);
    }
    // Get the total number of pages
    const totalNumberOfPages = await FYABackend.get('/boxHistory/boxCount', {
      params: {
        status,
        pageSize: PAGE_SIZE,
      },
    });
    setNumPages(totalNumberOfPages.data[0].totalNumberOfPages);
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
        changesRequested={boxData.changes_requested}
        pickup={boxData.pickup}
        fetchBoxes={fetchBoxes}
        imageStatus={boxData.image_status}
        launchedOrganically={boxData.launched_organically}
        admin={boxData.admin}
        verificationPicture={boxData.verification_picture}
        reloadMap={reloadMap}
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
        reloadMap={reloadMap}
      />
    );

  // Gets all boxes on page load
  useEffect(async () => {
    await fetchBoxes('under review');
  }, []);

  // Make another request to get the next page of boxes from the backend whenever pagination controls are used
  useEffect(async () => {
    await fetchBoxes(currentStatus);
  }, [underReviewPageIndex, pendingPageIndex, evaluatedPageIndex]);

  const handleTabClicked = status => {
    fetchBoxes(status);
    setCurrentStatus(status);
  };

  return (
    <>
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
                  {boxesUnderReview.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
                {/* 'Pending Changes' section */}
                <TabPanel className={styles['tab-panel']}>
                  {boxesPending.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
                {/* 'Evaluated' section */}
                <TabPanel className={styles['tab-panel']}>
                  {boxesEvaluated.map(boxData => mapDataToBox(boxData))}
                </TabPanel>
              </TabPanels>
            </div>

            {currentStatus === 'under review' && (
              <PaginationController
                paginatedIndex={underReviewPageIndex}
                setPaginatedIndex={setUnderReviewPageIndex}
                totalNumberOfPages={numPages}
              />
            )}
            {currentStatus === 'pending changes' && (
              <PaginationController
                paginatedIndex={pendingPageIndex}
                setPaginatedIndex={setPendingPageIndex}
                totalNumberOfPages={numPages}
              />
            )}
            {currentStatus === 'evaluated' && (
              <PaginationController
                paginatedIndex={evaluatedPageIndex}
                setPaginatedIndex={setEvaluatedPageIndex}
                totalNumberOfPages={numPages}
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
    </>
  );
};

BoxApproval.propTypes = {
  setZipCodeData: PropTypes.func.isRequired,
};

export default BoxApproval;
