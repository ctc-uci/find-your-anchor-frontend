import { React, useState, useMemo } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { Select as ReactSelect } from 'chakra-react-select';
import countryList from 'react-select-country-list';
import { BsFillCheckCircleFill, BsXCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';
import { RiPencilFill, RiCheckFill } from 'react-icons/ri';
import PropTypes from 'prop-types';
import styles from './PickupBox.module.css';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import PickupBoxIcon from '../../assets/BoxIcons/PickupBoxIcon.svg';
import ApprovedPickupIcon from '../../assets/BoxIcons/ApprovedPickupIcon.svg';
import RejectedPickupIcon from '../../assets/BoxIcons/RejectedPickupIcon.svg';
import PendingPickupIcon from '../../assets/BoxIcons/PendingPickupIcon.svg';
import AdminApprovalProcessEmail from '../Email/EmailTemplates/AdminApprovalProcessEmail';
import {
  AdminApprovalProcessEmailSubject,
  FYABackend,
  getLatLong,
  sendEmail,
} from '../../common/utils';
import { auth, getCurrentUser } from '../../common/auth_utils';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const PickupBox = ({
  approved,
  transactionID,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  country,
  picture,
  date,
  status,
  changesRequested,
  rejectionReason,
  fetchBoxes,
  pickup,
  imageStatus,
  launchedOrganically,
  admin,
  verificationPicture,
  reloadMap,
}) => {
  const countryOptions = useMemo(() => countryList().getData(), []);
  const boxFormData = {
    name: boxHolderName,
    email: boxHolderEmail,
    zipcode: zipCode,
    country: countryOptions.find(countryNameAndCode => countryNameAndCode.value === country),
    pickupMethod: launchedOrganically ? 'organic-launch' : 'given-box-directly',
  };
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: boxFormData,
    delayError: 750,
    mode: 'onChange',
  });
  // A state for determining whether or not the requestChangesPopup is open
  // This state is set true when the pending changes button is clicked
  const [requestChangesPopupIsOpen, setRequestChangesPopupIsOpen] = useState(false);
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  // A state for determining whether the fields under pending changes are editable
  // This state is set true when the edit button is clicked
  const [editPendingChangesState, setEditPendingChangesState] = useState(false);

  const { showToast } = useCustomToast();

  const onSubmit = async data => {
    const user = await getCurrentUser(auth);
    const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
    const formData = data;
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      status: 'pending changes',
      boxHolderName: formData.name,
      boxHolderEmail: formData.email,
      zipCode: formData.zipcode,
      country: formData.country.value,
      launchedOrganically: formData.pickupMethod === 'organic-launch',
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };
  // A function that updates the approved boolean in the backend and refreshes all boxes that are under review
  // This method is called when the approve box icon is clicked
  const approvePickupBox = async id => {
    try {
      const user = await getCurrentUser(auth);
      const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
      const formData = getValues();

      // Retrieve date of most recent transaction.
      const transaction = await FYABackend.get(`/boxHistory/mostRecentTransaction/${boxID}`);

      await FYABackend.put('/boxHistory/update', {
        transactionID: id,
        boxID,
        status: 'evaluated',
        approved: true,
        pickup,
        boxHolderName: formData.name,
        boxHolderEmail: formData.email,
        zipCode: formData.zipcode,
        country: formData.country.value,
        launchedOrganically: formData.pickupMethod === 'organic-launch',
        admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
      });
      if (
        transaction.data.length === 0 ||
        Date.parse(transaction.data[0].mostrecentdate) <= Date.parse(date)
      ) {
        // TODO: REPLACE US WITH COUNTRY INPUT
        let coordinates = await getLatLong(formData.zipcode, formData.country);
        if (coordinates.length !== 2) {
          coordinates = [null, null];
        }

        await FYABackend.put('/boxHistory/approveBox', {
          transactionID,
          latitude: coordinates[0],
          longitude: coordinates[1],
          isMostRecentDate: true,
        });
      } else {
        await FYABackend.put('/boxHistory/approveBox', { transactionID, isMostRecentDate: false });
      }
      const requests = [
        fetchBoxes('under review', true),
        reloadMap(),
        sendEmail(
          formData.name,
          formData.email,
          <AdminApprovalProcessEmail type="approved" />,
          AdminApprovalProcessEmailSubject,
        ),
      ];
      await Promise.all(requests);
      showToast({
        type: 'success',
        title: `Box #${boxID} Approved`,
        message: `Box #${boxID} succesfully added to map`,
        toastPosition: 'bottom-right',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: `Failed to Approve Box #${boxID}`,
        message: err.message,
        toastPosition: 'bottom-right',
      });
    }
  };

  const updateImageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      imageStatus: newStatus,
    });
    await fetchBoxes(status, true);
  };

  // A function that changes the color of the relocation box icon depending on whether it's approved, rejected, pending, or not yet evaluated
  const getColoredIcon = () => {
    if (status === 'evaluated' && approved) {
      return ApprovedPickupIcon;
    }
    if (status === 'evaluated' && !approved) {
      return RejectedPickupIcon;
    }
    if (status === 'pending changes') {
      return PendingPickupIcon;
    }
    return PickupBoxIcon;
  };

  // A function that creates the string that identifies which admin evaluated the box
  const getStatusMessage = () => {
    if (status === 'evaluated' && approved) {
      return <h4 className={styles['status-message-approved']}>Approved by {admin}</h4>;
    }
    if (status === 'evaluated' && !approved) {
      return <h4 className={styles['status-message-rejected']}>Rejected by {admin}</h4>;
    }
    if (status === 'pending changes') {
      return <h4 className={styles['status-message-pending']}>Pending Review by {admin}</h4>;
    }
    return '';
  };

  // A function that updates box information in the backend and refetches all boxes that are under review or pending changes (message status can be updated in 'under review')
  // This method is called when the save button is clicked under pending changes
  const updateBoxInfo = async newStatus => {
    const user = await getCurrentUser(auth);
    const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
    const formData = getValues();
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      status: newStatus,
      boxHolderName: formData.name,
      boxHolderEmail: formData.email,
      zipCode: formData.zipcode,
      country: formData.country.value,
      generalLocation: formData.boxLocation,
      launchedOrganically: formData.pickupMethod === 'organic-launch',
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });
  };

  // A function that handles when the middle button (move to pending changes or save changes) is clicked
  const handleMiddleButtonClicked = async () => {
    if (status === 'under review') {
      setRequestChangesPopupIsOpen(!requestChangesPopupIsOpen);
    } else {
      await updateBoxInfo('pending changes');
    }
  };

  return (
    <>
      <div
        className={`${styles.box}
        ${status === 'evaluated' && approved ? styles['box-approved'] : ''}
        ${status === 'evaluated' && !approved ? styles['box-rejected'] : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            {/* Pickup box ID and date */}
            <h3>
              <AccordionButton className={styles['accordion-button']}>
                <img src={getColoredIcon()} alt="" />
                <div className={styles['title-div']}>
                  <p className={styles.title}>
                    <p className={styles['box-number']}>Box #{boxID}</p>
                    {date}
                  </p>
                </div>
                <div className={styles['arrow-button']}>
                  <AccordionIcon />
                </div>
              </AccordionButton>
            </h3>
            {/* Box details */}
            <AccordionPanel className={styles['accordion-panel']} pb={4}>
              <div className={styles['review-header']}>
                {getStatusMessage()}
                {status === 'pending changes' && (
                  <button
                    type="button"
                    className={styles['pencil-check-icon']}
                    onClick={() => {
                      setEditPendingChangesState(!editPendingChangesState || !isValid);
                    }}
                  >
                    {editPendingChangesState ? (
                      <RiCheckFill
                        color="var(--color-success)"
                        size={20}
                        onClick={handleSubmit(onSubmit)}
                      />
                    ) : (
                      <RiPencilFill color="var(--color-gray)" size={20} />
                    )}
                  </button>
                )}
              </div>
              <div className={styles['box-details']}>
                {status !== 'evaluated' && verificationPicture && (
                  <>
                    <FormLabel htmlFor="verificationPicture">Box Number Verification</FormLabel>
                    <img src={verificationPicture} alt="" className={styles['image-corners']} />
                  </>
                )}
                {(status !== 'evaluated' || imageStatus !== 'rejected') && picture && (
                  <>
                    <FormLabel htmlFor="boxImage" className={styles['form-label']}>
                      Box Image
                    </FormLabel>
                    <img
                      src={picture}
                      alt=""
                      className={`${styles['image-corners']}
                      ${imageStatus === 'approved' ? `${styles['image-approved']}` : ''}
                      ${imageStatus === 'rejected' ? `${styles['image-rejected']}` : ''}`}
                    />
                  </>
                )}
                {picture && status !== 'evaluated' && (
                  <div className={styles['image-functionality-wrapper']}>
                    {/* Image approved indicator (only show if image is approved) */}
                    <div className={styles['image-functionality']}>
                      {imageStatus === 'approved' && (
                        <>
                          <button type="button" className={styles['approval-button']}>
                            <BsFillCheckCircleFill color="var(--color-success)" />
                          </button>
                          <p
                            className={`${styles['status-message']} ${styles['approval-message']}`}
                          >
                            Photo Approved
                          </p>
                        </>
                      )}
                      {/* Image rejected indicator (only show if image is rejected) */}
                      {imageStatus === 'rejected' && (
                        <>
                          <button type="button" className={styles['rejection-button']}>
                            <BsXCircleFill color="var(--color-warning)" />
                          </button>
                          <p
                            className={`${styles['status-message']} ${styles['rejection-message']}`}
                          >
                            Photo Denied
                          </p>
                        </>
                      )}
                    </div>
                    {imageStatus !== 'rejected' && imageStatus !== 'approved' && picture && (
                      <>
                        {/* Approve image button */}
                        <button
                          type="button"
                          className={styles['image-approved-button']}
                          onClick={async () => updateImageStatus('approved')}
                        >
                          <BsFillCheckCircleFill color="var(--color-success)" />
                        </button>
                        {/* Reject image button */}
                        <button
                          type="button"
                          className={styles['image-rejected-button']}
                          onClick={async () => updateImageStatus('rejected')}
                        >
                          <BsXCircleFill color="var(--color-warning)" />
                        </button>
                      </>
                    )}
                    {(imageStatus === 'rejected' || imageStatus === 'approved') && picture && (
                      <Button
                        variant="outline"
                        className={styles['undo-button']}
                        paddingTop="0px"
                        paddingBottom="0px"
                        paddingLeft="8px"
                        paddingRight="8px"
                        borderRadius="6px"
                        borderColor="var(--color-light-gray)"
                        size="sm"
                        onClick={async () => updateImageStatus('pending')}
                      >
                        Undo
                      </Button>
                    )}
                  </div>
                )}
                <FormControl>
                  {/* Box name */}
                  <FormLabel htmlFor="name" className={styles['form-label']}>
                    Name
                  </FormLabel>
                  <Input
                    readOnly={!editPendingChangesState}
                    id="name"
                    type="name"
                    // value={boxHolderName}
                    {...register('name')}
                  />
                  {/* Box email */}
                  <FormLabel
                    readOnly={!editPendingChangesState}
                    htmlFor="email"
                    className={styles['form-label']}
                  >
                    Email
                  </FormLabel>
                  <Input
                    readOnly={!editPendingChangesState}
                    id="email"
                    type="email"
                    {...register('email')}
                  />
                  {/* Box zip code */}
                  <FormLabel htmlFor="zipCode" className={styles['form-label']}>
                    Zip Code
                  </FormLabel>
                  <Input
                    readOnly={!editPendingChangesState}
                    id="zipcode"
                    type="zipcode"
                    // value={zipCode}
                    {...register('zipcode')}
                  />
                  {/* Box country */}
                  <FormLabel htmlFor="country" className={styles['form-label']}>
                    Country
                  </FormLabel>
                  <Controller
                    control={control}
                    name="country"
                    // eslint-disable-next-line no-unused-vars
                    render={({ field: { onChange, value, ref } }) => (
                      <ReactSelect
                        isDisabled={status !== 'pending changes' || !editPendingChangesState}
                        value={value}
                        options={countryOptions}
                        onChange={onChange}
                      />
                    )}
                  />
                  {/* Whether the box was launched organically */}
                  <FormLabel htmlFor="launchedOrganically" className={styles['form-label']}>
                    Pick up method
                  </FormLabel>
                  <Select
                    disabled={status !== 'pending changes' || !editPendingChangesState}
                    {...register('pickupMethod')}
                  >
                    <option value="given-box-directly">Given a box directly</option>
                    <option value="organic-launch">Found box organically</option>
                  </Select>
                  {/* Changes requested text area (only show if box is under pending changes) */}
                  {status === 'pending changes' && (
                    <div>
                      <FormLabel htmlFor="changesRequested" className={styles['form-label']}>
                        Changes Requested
                      </FormLabel>
                      <Textarea isReadOnly value={changesRequested} resize="vertical" />
                    </div>
                  )}
                  {/* Rejection reason text area (only show if box has been evaluated and bxo was rejected) */}
                  {status === 'evaluated' && !approved && (
                    <>
                      <FormLabel htmlFor="rejectionReason" className={styles['form-label']}>
                        Rejection Reason
                      </FormLabel>
                      <Textarea readOnly value={rejectionReason} resize="vertical" />
                    </>
                  )}
                </FormControl>
                {/* Button toolbar (only show if box hasn't been evaluated) */}
                {status !== 'evaluated' && (
                  <div className={styles['icon-row']}>
                    {/* Reject box button */}
                    <div className={styles['close-icon']}>
                      <button
                        type="button"
                        onClick={() => setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen)}
                      >
                        <BsXCircleFill className={styles['rejected-icon']} />
                      </button>
                    </div>
                    <div className={styles['arrow-forward-icon']}>
                      <button type="button" onClick={async () => handleMiddleButtonClicked()}>
                        {status === 'under review' && (
                          <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
                        )}
                      </button>
                    </div>
                    {/* Approve box button */}
                    <div className={styles['check-icon']}>
                      <button type="button" onClick={() => approvePickupBox(transactionID)}>
                        <BsFillCheckCircleFill className={styles['approved-icon']} />
                      </button>
                    </div>
                    <RequestChangesPopup
                      boxHolderName={getValues().name}
                      boxHolderEmail={getValues().email}
                      isOpen={requestChangesPopupIsOpen}
                      setIsOpen={setRequestChangesPopupIsOpen}
                      transactionID={transactionID}
                      boxID={boxID}
                      pickup={pickup}
                      fetchBoxes={fetchBoxes}
                    />
                    <RejectBoxPopup
                      isOpen={rejectBoxPopupIsOpen}
                      setIsOpen={setRejectBoxPopupIsOpen}
                      transactionID={transactionID}
                      boxID={boxID}
                      boxHolderName={boxHolderName}
                      boxHolderEmail={boxHolderEmail}
                      zipCode={zipCode}
                      pickup={pickup}
                      fetchBoxes={fetchBoxes}
                    />
                  </div>
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

PickupBox.propTypes = {
  approved: PropTypes.bool.isRequired,
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  changesRequested: PropTypes.string.isRequired,
  pickup: PropTypes.bool.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
  imageStatus: PropTypes.string.isRequired,
  launchedOrganically: PropTypes.bool.isRequired,
  admin: PropTypes.string.isRequired,
  verificationPicture: PropTypes.string.isRequired,
  reloadMap: PropTypes.func.isRequired,
};

export default PickupBox;
