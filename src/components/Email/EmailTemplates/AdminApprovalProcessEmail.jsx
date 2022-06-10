import React from 'react';
import PropTypes from 'prop-types';
import { Email } from 'react-html-email';

import {
  BoxApprovedEmailPicture,
  BoxRejectedEmailPicture,
  ChangesRequestedEmailPicture,
  FYATextLogo,
} from '../../../common/utils';

// The type of email sent depends directly on the 'type' prop passed in ('approved', 'changes requested', or 'rejected')
// Inline styling is necessary because it won't detect styles from a separate css page :D
const AdminApprovalProcessEmail = ({ type, changesRequested, rejectionReason }) => {
  // Header text
  const headerDict = {
    approved: 'Your box launch has been approved!',
    'changes requested': 'Your box launch requires changes.',
    rejected: 'Your box launch could not be added.',
  };
  // Text below the header
  const headerSubtextDict = {
    approved: '',
    'changes requested':
      "We're so close! We just need a little more information from you in order to add your box to the FYA Launch Map.",
    rejected: "We're sorry, we couldn't add your box to the FYA Launch Map",
  };
  // Text below "What does this mean"
  const whatDoesThisMeanDict = {
    approved: (
      <p style={{ margin: 0, color: 'black' }}>
        Your box&rsquo;s journey has been added to the FYA Launch Map!
      </p>
    ),
    'changes requested': (
      <p style={{ margin: 0, color: 'black' }}>
        We&rsquo;re missing some information to verify your box. Please follow the steps below to
        complete the process, so we can get it added to the FYA Launch Map!
      </p>
    ),
    rejected: (
      <>
        <p style={{ margin: 0, color: 'black' }}>
          For some reason we were not able to verify your box and as a result, could not add it to
          the FYA Launch Map.
        </p>
        <br />
        <p style={{ margin: 0, color: 'black' }}>
          If you believe this is an error and the box should be added, please email us at{' '}
          <span
            style={{
              'font-weight': 700,
            }}
          >
            hello@findyouranchor.us
          </span>
        </p>
      </>
    ),
  };
  // Next steps list
  const nextStepsDict = {
    approved: [
      <li key={0}>
        Find your box on the Launch Map{' '}
        <a
          href={`${process.env.REACT_APP_BASE_URL}`}
          style={{
            'font-weight': 700,
          }}
        >
          here
        </a>
      </li>,
      <li key={1}>Share your launch on social media!</li>,
      <li key={2}>Soak in all the good karma for helping us spread more love!</li>,
    ],
    'changes requested': [
      <li key={1}>
        Resubmit your box request including the missing information{' '}
        <a
          href={`${process.env.REACT_APP_BASE_URL}`}
          style={{
            'font-weight': 700,
          }}
        >
          here
        </a>
      </li>,
      <li key={2}>Wait for a new submission confirmation email</li>,
      <li key={3}>
        Any questions? Email us at{' '}
        <span
          style={{
            'font-weight': 700,
          }}
        >
          hello@findyouranchor.us
        </span>
      </li>,
    ],
    rejected: [],
  };
  // The image to show on the right of the email
  const imageSourceDict = {
    approved: BoxApprovedEmailPicture,
    'changes requested': ChangesRequestedEmailPicture,
    rejected: BoxRejectedEmailPicture,
  };

  const headerContent = headerDict[type];
  const headerSubtextContent = headerSubtextDict[type];
  let nextStepsContent = [];
  if (type === 'changes requested') {
    nextStepsContent = changesRequested
      ? [<li key={0}>{changesRequested}</li>].concat(nextStepsDict[type])
      : nextStepsDict[type];
  } else if (type === 'rejected') {
    nextStepsContent = rejectionReason
      ? [<li key={0}>{rejectionReason}</li>].concat(nextStepsDict[type])
      : nextStepsDict[type];
  } else {
    nextStepsContent = nextStepsDict[type];
  }
  const whatDoesThisMeanContent = whatDoesThisMeanDict[type];
  const imageSource = imageSourceDict[type];

  return (
    <Email>
      <div
        className="joe"
        style={{
          position: 'relative',
          width: '800px',
        }}
      >
        <img
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          src={FYATextLogo}
          alt="FYA logo"
        />
        <h1
          style={{
            'font-weight': 700,
            color: 'var(--color-teal)',
            'font-size': '24px',
            padding: '100px 0 0 0',
            margin: 0,
          }}
        >
          {headerContent}
        </h1>
        <p style={{ color: 'black' }}>{headerSubtextContent}</p>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '60%',
              'padding-top': '30px',
            }}
          >
            <div
              style={{
                padding: '0 0 20px 0',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  'font-size': '18px',
                  'font-weight': 700,
                  color: 'var(--color-teal)',
                  'text-transform': 'uppercase',
                }}
              >
                What does this mean?
              </h2>
              {whatDoesThisMeanContent}
            </div>
            {type !== 'rejected' && (
              <div>
                <h2
                  style={{
                    margin: 0,
                    'font-size': '18px',
                    'font-weight': 700,
                    color: 'var(--color-teal)',
                    'text-transform': 'uppercase',
                  }}
                >
                  Next steps:
                </h2>
                <ul
                  style={{
                    margin: 0,
                    padding: '0 0 0 20px',
                    color: 'black',
                  }}
                >
                  {nextStepsContent}
                </ul>
              </div>
            )}
          </div>
          <img
            style={{ width: '250px', height: '211.5px' }}
            src={imageSource}
            alt="Approved box icon"
          />
        </div>
      </div>
    </Email>
  );
};

AdminApprovalProcessEmail.defaultProps = {
  changesRequested: null,
  rejectionReason: null,
};

AdminApprovalProcessEmail.propTypes = {
  type: PropTypes.string.isRequired,
  changesRequested: PropTypes.string,
  rejectionReason: PropTypes.string,
};

export default AdminApprovalProcessEmail;
