import { React, useEffect } from 'react';
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
  const { boxID, name, email, currentLocation, picture, generalLocation, message, date } = props;

  // update to move box from under review to evaluated
  // const [RelocationBoxFromUR, updateApproval] = useState([]);
  // const [, updateState] = useState();
  // const forceUpdate = useCallback(() => updateState({}), []);

  RelocationBox.propTypes = {
    boxID: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    currentLocation: PropTypes.number.isRequired,
    picture: PropTypes.string.isRequired,
    generalLocation: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  };

  const approveRelocationBoxFromUR = response => {
    utils.put('/relocationBoxes/approved', {
      box_id: response,
    });
  };
  useEffect(() => approveRelocationBoxFromUR(), []);

  const rejectRelocationBoxFromUR = response => {
    utils.put('/relocationBoxes/rejected', {
      box_id: response,
    });
  };
  useEffect(() => rejectRelocationBoxFromUR(), []);

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
                  <Input isReadOnly id="name" type="name" placeholder={name} />
                  <FormLabel htmlFor="email" marginTop="5%">
                    Email
                  </FormLabel>
                  <Input isReadOnly id="email" type="email" placeholder={email} />
                  <FormLabel htmlFor="zipCode" marginTop="5%">
                    Zip Code
                  </FormLabel>
                  <Input isReadOnly id="zipCode" type="zipCode" placeholder={currentLocation} />
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
                        rejectRelocationBoxFromUR(boxID);
                      }}
                    >
                      <img src={RejectBoxIcon} alt="" />
                    </button>
                  </div>
                  <div className="arrowForwardIcon">
                    <button type="button">
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
