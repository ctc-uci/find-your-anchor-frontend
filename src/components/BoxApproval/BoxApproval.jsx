import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import Box from '../Box/Box';
import './BoxApproval.css';

function BoxApproval() {
  const [currentTab, setCurrentTab] = useState('underReview');
  // eslint-disable-next-line no-unused-vars
  const [underReviewBoxes, setunderReviewBoxes] = useState([Box(), Box(), Box()]);
  // eslint-disable-next-line no-unused-vars
  const [previouslyReviewedBoxes, setpreviouslyReviewedBoxes] = useState([Box(), Box()]);

  return (
    <div className="boxApproval">
      <h1 className="boxApprovalHeading">Box Approval</h1>
      <div className="boxApprovalTabs">
        <Button
          onClick={() => setCurrentTab('underReview')}
          width="50%"
          className={`button-${currentTab === 'underReview'}`}
        >
          <p className="buttonText">Under Review</p>
        </Button>
        <Button
          onClick={() => setCurrentTab('previouslyReviewed')}
          width="50%"
          className={`button-${currentTab === 'previouslyReviewed'}`}
        >
          <p className="buttonText">Previously Reviewed</p>
        </Button>
      </div>

      {currentTab === 'underReview' ? underReviewBoxes : previouslyReviewedBoxes}
    </div>
  );
}

export default BoxApproval;
