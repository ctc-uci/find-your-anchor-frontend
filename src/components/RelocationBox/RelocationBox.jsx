import { React } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';

import './RelocationBox.css';
import PropTypes from 'prop-types';
import ApproveBoxIcon from '../BoxIcons/ApproveBoxIcon.svg';
import RejectBoxIcon from '../BoxIcons/RejectBoxIcon.svg';
import RelocateBoxIcon from '../BoxIcons/RelocateBoxIcon.svg';
import RequestChangesIcon from '../BoxIcons/RequestChangesIcon.svg';
import utils from '../../common/utils';

function RelocationBox(props) {
  const { boxID, boxHolderName, boxHolderEmail, zipCode, picture, generalLocation, message, date } =
    props;

  // key={boxData.box_id}
  //             box_id={boxData.box_id}
  //             boxholder_name={boxData.boxholder_name}
  //             boxholder_email={boxData.boxholder_email}
  //             zip_code={boxData.zip_code}
  //             picture={boxData.picture}
  //             genera_location={boxData.general_location}
  //             message={boxData.message}
  //             date={boxData.date}

  RelocationBox.propTypes = {
    boxID: PropTypes.number.isRequired,
    boxHolderName: PropTypes.string.isRequired,
    boxHolderEmail: PropTypes.string.isRequired,
    zipCode: PropTypes.number.isRequired,
    picture: PropTypes.string.isRequired,
    generalLocation: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  };

  const updateBoxStatus = (id, stat) => {
    utils.put('/box/updateStatus', {
      params: {
        boxID: id,
        status: stat,
      },
    });
  };

  const approveRelocationBoxFromUR = id => {
    utils.put('/box/approveBox', {
      boxID: id,
    });
  };

  // const rejectRelocationBoxFromUR = id => {
  //   utils.put('/box/updateStatus', {
  //     params: {
  //       box_id: id,
  //       status: 'approved',
  //     },
  //   });
  // };

  return (
    <ChakraProvider>
      <div className="box">
        <Accordion allowToggle>
          <AccordionItem>
            <h3>
              <AccordionButton>
                <div className="pictureDiv">
                  <img src={RelocateBoxIcon} alt=" " />
                </div>
                <div className="titleDiv">
                  <p className="title">
                    <p className="boxNumber">Box #{boxID}</p>
                    {date}
                  </p>
                </div>
                <div className="arrowButton">
                  <AccordionIcon />
                </div>
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <div className="boxDetails">
                <img src={picture} alt=" " className="imageCorners" />
                <FormControl>
                  <FormLabel htmlFor="name" marginTop="5%">
                    Name
                  </FormLabel>
                  <Input isReadOnly id="name" type="name" placeholder={boxHolderName} />
                  <FormLabel htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input isReadOnly id="email" type="email" placeholder={boxHolderEmail} />
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input isReadOnly id="zipCode" type="zipCode" placeholder={zipCode} />
                  <FormLabel htmlFor="generalLocation" marginTop="5%">
                    General Location
                  </FormLabel>
                  <Input
                    isReadOnly
                    id="generalLocation"
                    type="generalLocation"
                    placeholder={generalLocation}
                  />
                  <FormLabel htmlFor="dropOffMethod" marginTop="5%">
                    Drop Off Method
                  </FormLabel>
                  <Select id="generalLocation" placeholder="Select Method">
                    <option> Given to Someone</option>
                    <option> Left at Location</option>
                  </Select>
                  <FormLabel htmlFor="Message" marginTop="5%">
                    Message
                  </FormLabel>
                </FormControl>
                <Textarea placeholder={message} size="sm" resize="vertical" />
                <div className="iconRow">
                  <div className="closeIcon">
                    <button
                      type="button"
                      onClick={() => {
                        updateBoxStatus(boxID, 'rejected');
                      }}
                    >
                      <img src={RejectBoxIcon} alt="" />
                    </button>
                  </div>
                  <div className="arrowForwardIcon">
                    <button
                      type="button"
                      onClick={() => {
                        updateBoxStatus(boxID, 'pending changes');
                      }}
                    >
                      <img src={RequestChangesIcon} alt="" />
                    </button>
                  </div>
                  <div className="checkIcon">
                    <button
                      type="button"
                      onClick={() => {
                        approveRelocationBoxFromUR(boxID);
                      }}
                    >
                      <img src={ApproveBoxIcon} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </ChakraProvider>
  );
}
export default RelocationBox;
