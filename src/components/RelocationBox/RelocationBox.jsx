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
  FormErrorMessage,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Select as ReactSelect } from 'chakra-react-select';
import countryList from 'react-select-country-list';
import { BsFillArrowRightCircleFill, BsFillCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
import { RiPencilFill, RiCheckFill } from 'react-icons/ri';
import PropTypes from 'prop-types';
import RelocateBoxIcon from '../../assets/BoxIcons/RelocateBoxIcon.svg';
import PendingRelocationIcon from '../../assets/BoxIcons/PendingRelocationIcon.svg';
import RejectedRelocationIcon from '../../assets/BoxIcons/RejectedRelocationIcon.svg';
import ApprovedRelocationIcon from '../../assets/BoxIcons/ApprovedRelocationIcon.svg';
import {
  FYABackend,
  getLatLong,
  sendEmail,
  AdminApprovalProcessEmailSubject,
} from '../../common/utils';
import AdminApprovalProcessEmail from '../Email/EmailTemplates/AdminApprovalProcessEmail';
import { auth, getCurrentUser } from '../../common/auth_utils';
import RequestChangesPopup from '../AlertPopups/RequestChangesPopup/RequestChangesPopup';
import RejectBoxPopup from '../AlertPopups/RejectBoxPopup/RejectBoxPopup';
import styles from './RelocationBox.module.css';
import { useCustomToast } from '../ToastProvider/ToastProvider';

const schema = yup
  .object({
    name: yup.string().typeError('Invalid name'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Invalid email address, please enter a valid email address')
      .typeError('Invalid email address, please enter a valid email address'),
    zipcode: yup.string().required('Invalid zipcode, please enter a valid zipcode'),
    country: yup.object({
      label: yup.string().required('Invalid country, please select a country'),
      value: yup.string().required('Invalid country, please select a country'),
    }),
    boxLocation: yup.string().typeError('Invalid location, please enter a valid location'),
    dropOffMethod: yup
      .string()
      .required('Invalid drop off method, please enter a valid drop off method'),
  })
  .required();

const RelocationBox = ({
  approved,
  transactionID,
  boxID,
  boxHolderName,
  boxHolderEmail,
  zipCode,
  boxCountry,
  picture,
  generalLocation,
  message,
  date,
  status,
  changesRequested,
  rejectionReason,
  messageStatus,
  fetchBoxes,
  pickup,
  launchedOrganically,
  imageStatus,
  admin,
  verificationPicture,
  reloadMap,
}) => {
  const { showToast } = useCustomToast();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const boxFormData = {
    name: boxHolderName,
    email: boxHolderEmail,
    zipcode: zipCode,
    country: countryOptions.find(countryNameAndCode => countryNameAndCode.value === boxCountry),
    boxLocation: generalLocation,
    dropOffMethod: launchedOrganically ? 'organic-launch' : 'given-to-someone',
  };
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: boxFormData,
    resolver: yupResolver(schema),
    delayError: 750,
    mode: 'onChange',
  });
  // A state for determining whether or not the rejectBoxPopup is open
  // This state is set true when the reject button is clicked
  const [rejectBoxPopupIsOpen, setRejectBoxPopupIsOpen] = useState(false);
  // A state for determining whether or not the requestChangesPopup is open
  // This state is set true when the pending changes button is clicked
  const [requestChangesPopupIsOpen, setRequestChangesPopupIsOpen] = useState(false);
  // A state for determining whether the fields under pending changes are editable
  // This state is set true when the edit button is clicked
  const [editPendingChangesState, setEditPendingChangesState] = useState(false);
  // // A state for the box's message
  // This state is updated when the user edits the message under pending changes
  const [messageState, setMessageState] = useState(message);

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
      message: messageState,
      launchedOrganically: formData.dropOffMethod === 'organic-launch',
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };

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
      generalLocation: formData.boxLocation,
      message: messageState,
      launchedOrganically: formData.dropOffMethod === 'organic-launch',
      admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
    });

    const requests = [fetchBoxes('under review', false), fetchBoxes('pending changes', false)];
    await Promise.all(requests);
  };

  // A function that approves a relocation box submission and updates the backend state accordingly and then refetches all boxes (boxes can be approved from any tab)
  const approveRelocationBox = async () => {
    try {
      const user = await getCurrentUser(auth);
      const userInDB = await FYABackend.get(`/users/userId/${user.uid}`);
      const formData = getValues();

      // Retrieve date of most recent transaction.
      const transaction = await FYABackend.get(`/boxHistory/mostRecentTransaction/${boxID}`);

      await FYABackend.put('/boxHistory/update', {
        transactionID,
        boxID,
        status,
        boxHolderName: formData.name,
        boxHolderEmail: formData.email,
        zipCode: formData.zipcode,
        country: formData.country.value,
        generalLocation: formData.boxLocation,
        message: messageState,
        launchedOrganically: formData.dropOffMethod === 'organic-launch',
        admin: `${userInDB.data.user.first_name} ${userInDB.data.user.last_name}`,
      });

      if (
        transaction.data.length === 0 ||
        Date.parse(transaction.data[0].mostrecentdate) <= Date.parse(date)
      ) {
        // Just in case the country value is null so it doesnt break, we can remove it once we clear the DB and have correct data
        let coordinates = await getLatLong(zipCode, formData.country.value);

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
        fetchBoxes('under review', false),
        fetchBoxes('pending changes', false),
        fetchBoxes('evaluated', false),
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

  // A function that updates imageStatus in the backend when a user clicks on the accept/reject buttons below the box's image
  const updateImageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      imageStatus: newStatus,
    });
    await fetchBoxes(status, false);
  };

  // A function that updates imageStatus in the backend when a user clicks on the accept/reject buttons below the message
  const updateMessageStatus = async newStatus => {
    await FYABackend.put('/boxHistory/update', {
      transactionID,
      boxID,
      messageStatus: newStatus,
    });
    await fetchBoxes(status, false);
  };

  // A function that handles when the middle button (move to pending changes or save changes) is clicked
  const handleMiddleButtonClicked = async () => {
    if (status === 'under review') {
      setRequestChangesPopupIsOpen(!requestChangesPopupIsOpen);
    } else {
      await updateBoxInfo('pending changes');
    }
  };

  // A function that changes the color of the relocation box icon depending on whether it's approved, rejected, pending, or not yet evaluated
  const getColoredIcon = () => {
    if (status === 'evaluated' && approved) {
      return ApprovedRelocationIcon;
    }
    if (status === 'evaluated' && !approved) {
      return RejectedRelocationIcon;
    }
    if (status === 'pending changes') {
      return PendingRelocationIcon;
    }
    return RelocateBoxIcon;
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

  return (
    <>
      <div
        // Conditional classes for approved/pending changes/rejected boxes to determine background coloring
        className={`${styles.box}
        ${status === 'evaluated' && approved ? styles['box-approved'] : ''}
        ${status === 'evaluated' && !approved ? styles['box-rejected'] : ''}
        ${status === 'pending changes' ? styles['box-pending'] : ''}`}
      >
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton className={styles['accordion-button']}>
                {/* Relocation box icon */}
                <div className={styles['picture-div']}>
                  <img src={getColoredIcon()} alt=" " width="100%" height="auto" />
                </div>
                {/* Box Number & date */}
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

            {/* Box picture */}
            <AccordionPanel pb={4} className={styles['accordion-panel']}>
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
                    <FormLabel htmlFor="verificationPicture" className={styles['picture-label']}>
                      Box Number Verification
                    </FormLabel>
                    <img src={verificationPicture} alt="" className={styles['image-corners']} />
                  </>
                )}
                {(status !== 'evaluated' || imageStatus !== 'rejected') && picture && (
                  <>
                    <FormLabel
                      htmlFor="boxImage"
                      className={`${styles['picture-label']} ${styles['form-label']}`}
                    >
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
                {/* Box Name */}
                <form className={styles['edit-box-form']} onSubmit={handleSubmit(onSubmit)}>
                  <FormControl isInvalid={errors?.name}>
                    <FormLabel htmlFor="name" className={styles['form-label']}>
                      Name
                    </FormLabel>
                    <Input
                      isReadOnly={status !== 'pending changes' || !editPendingChangesState}
                      id="name"
                      type="text"
                      {...register('name')}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                  {/* Box Email */}
                  <FormControl isInvalid={errors?.email}>
                    <FormLabel htmlFor="email" className={styles['form-label']}>
                      Email
                    </FormLabel>
                    <Input
                      isReadOnly={status !== 'pending changes' || !editPendingChangesState}
                      id="email"
                      type="text"
                      {...register('email')}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  {/* Box Zip Code */}
                  <FormControl
                    isInvalid={errors?.zipcode || errors['']?.message.startsWith('Postal code')}
                  >
                    <FormLabel htmlFor="zipCode" className={styles['form-label']}>
                      Zip Code
                    </FormLabel>
                    <Input
                      isReadOnly={status !== 'pending changes' || !editPendingChangesState}
                      id="zipCode"
                      name="zipcode"
                      type="text"
                      {...register('zipcode')}
                    />
                    <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
                    {errors['']?.message !== 'zip validated' && (
                      <FormErrorMessage>{!errors.zipcode && errors['']?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  {/* Country */}
                  <FormControl isInvalid={errors?.country}>
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
                    <FormErrorMessage>{errors.country?.label.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors?.boxLocation}>
                    <FormLabel htmlFor="generalLocation" className={styles['form-label']}>
                      General Location
                    </FormLabel>
                    <Input
                      isReadOnly={status !== 'pending changes' || !editPendingChangesState}
                      id="generalLocation"
                      type="text"
                      name="boxLocation"
                      {...register('boxLocation')}
                    />
                    <FormErrorMessage>{errors.boxLocation?.message}</FormErrorMessage>
                  </FormControl>
                  {/* Box's Launched Organically field */}
                  <FormControl isInvalid={errors?.dropOffMethod}>
                    <FormLabel htmlFor="launchedOrganically" className={styles['form-label']}>
                      Drop Off Method
                    </FormLabel>
                    <Select
                      disabled={status !== 'pending changes' || !editPendingChangesState}
                      {...register('dropOffMethod')}
                    >
                      <option value="given-to-someone">Given to Someone</option>
                      <option value="organic-launch">Launched at a location</option>
                    </Select>
                    <FormErrorMessage>{errors.dropOffMethod?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl>
                    {/* Box's message (only show if the box isn't evaluated or message isn't rejected) */}
                    {!(status === 'evaluated' && messageStatus === 'rejected') && (
                      <>
                        <FormLabel htmlFor="Message" className={styles['form-label']}>
                          Message
                        </FormLabel>
                        <Textarea
                          className={`${
                            messageStatus === 'approved' ? `${styles['message-approved']}` : ''
                          }
                          ${messageStatus === 'rejected' ? `${styles['message-rejected']}` : ''}`}
                          isReadOnly={status !== 'pending changes' || !editPendingChangesState}
                          value={messageState}
                          onChange={e => setMessageState(e.target.value)}
                        />
                      </>
                    )}
                    {/* Message button toolbar (Only show if box hasn't been evaluted yet) */}
                    {status !== 'evaluated' && (
                      <div className={styles['message-functionality-wrapper']}>
                        {/* Message approved indicator (only show if message is approved) */}
                        <div className={styles['message-functionality']}>
                          {messageStatus === 'approved' && (
                            <>
                              <button type="button" className={styles['approval-button']}>
                                <BsFillCheckCircleFill color="var(--color-success)" />
                              </button>
                              <p
                                className={`${styles['status-message']} ${styles['approval-message']}`}
                              >
                                Message Approved
                              </p>
                            </>
                          )}
                          {/* Message rejected indicator (only show if message is rejected) */}
                          {messageStatus === 'rejected' && (
                            <>
                              <button type="button" className={styles['rejection-button']}>
                                <BsXCircleFill color="var(--color-warning)" />
                              </button>
                              <p
                                className={`${styles['status-message']} ${styles['rejection-message']}`}
                              >
                                Message Denied
                              </p>
                            </>
                          )}
                        </div>
                        {/* Approve message button */}
                        <button
                          type="button"
                          className={styles['message-approved-button']}
                          onClick={async () => updateMessageStatus('approved')}
                        >
                          <BsFillCheckCircleFill color="var(--color-success)" />
                        </button>
                        {/* Reject message button */}
                        <button
                          type="button"
                          className={styles['message-rejected-button']}
                          onClick={async () => updateMessageStatus('rejected')}
                        >
                          <BsXCircleFill color="var(--color-warning)" />
                        </button>
                      </div>
                    )}
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
                        <Textarea isReadOnly value={rejectionReason} resize="vertical" />
                      </>
                    )}
                  </FormControl>
                </form>
                {/* Button toolbar (only show if box hasn't been evaluated) */}
                {status !== 'evaluated' && (
                  <div className={styles['icon-row']}>
                    {/* Reject box button */}
                    <div className={styles['close-icon']}>
                      <button
                        type="button"
                        onClick={async () => setRejectBoxPopupIsOpen(!rejectBoxPopupIsOpen)}
                      >
                        <BsXCircleFill className={styles['reject-box-icon']} />
                      </button>
                    </div>
                    {/* Pending changes (if the box is under review) or Save (if the box is under pending changes) button */}
                    <div className={styles['arrow-forward-icon']}>
                      <button type="button" onClick={async () => handleMiddleButtonClicked()}>
                        {status === 'under review' && (
                          <BsFillArrowRightCircleFill className={styles['request-changes-icon']} />
                        )}
                      </button>
                    </div>
                    {/* Accept box button */}
                    <div className={styles['check-icon']}>
                      <button type="button" onClick={async () => approveRelocationBox(boxID)}>
                        <BsFillCheckCircleFill className={styles['approve-box-icon']} />
                      </button>
                    </div>
                  </div>
                )}
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
                  boxHolderName={boxHolderName}
                  boxHolderEmail={boxHolderEmail}
                  isOpen={rejectBoxPopupIsOpen}
                  setIsOpen={setRejectBoxPopupIsOpen}
                  transactionID={transactionID}
                  boxID={boxID}
                  pickup={pickup}
                  fetchBoxes={fetchBoxes}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

RelocationBox.propTypes = {
  approved: PropTypes.bool.isRequired,
  transactionID: PropTypes.number.isRequired,
  boxID: PropTypes.number.isRequired,
  boxHolderName: PropTypes.string.isRequired,
  boxHolderEmail: PropTypes.string.isRequired,
  zipCode: PropTypes.string.isRequired,
  boxCountry: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  generalLocation: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  changesRequested: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
  messageStatus: PropTypes.string.isRequired,
  fetchBoxes: PropTypes.func.isRequired,
  pickup: PropTypes.bool.isRequired,
  launchedOrganically: PropTypes.bool.isRequired,
  imageStatus: PropTypes.string.isRequired,
  admin: PropTypes.string.isRequired,
  verificationPicture: PropTypes.string.isRequired,
  reloadMap: PropTypes.func.isRequired,
};

export default RelocationBox;
