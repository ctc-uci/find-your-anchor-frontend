import React from 'react';
import PropTypes from 'prop-types';
import { Email } from 'react-html-email';

// import styles from './AdminApprovalProcessEmail.module.css';
// import ChangesRequestedEmailPicture from '../../../assets/ChangesRequestedEmailPicture.svg';
// import BoxRejectedEmailPicture from '../../../assets/BoxRejectedEmailPicture.svg';
// import FYATextLogo from '../../../assets/fya-text-logo.svg';
import {
  BoxApprovedEmailPicture,
  BoxRejectedEmailPicture,
  ChangesRequestedEmailPicture,
  FYATextLogo,
} from '../../../common/utils';

const AdminApprovalProcessEmail = ({ type, changesRequested, rejectionReason }) => {
  const headerDict = {
    approved: 'Your box launch has been approved!',
    'changes requested': 'Your box launch requires changes.',
    rejected: 'Your box launch could not be added.',
  };

  const headerSubtextDict = {
    approved: null,
    'changes requested': (
      <p>
        We&rsquo;re so close! We just need a little more information from you in order to add box to
        the FYA Launch Map.
      </p>
    ),
    rejected: <p>We&rsquo;re sorry, we couldn&rsquo;t add your box to the FYA Launch Map</p>,
  };

  const whatDoesThisMeanDict = {
    approved: <p>Your box&rsquo;s journey has been added to the FYA Launch Map!</p>,
    'changes requested': (
      <p>
        We&rsquo;re missing some information to verify your box. Please follow the steps below to
        complete the process, so we can get it added to the FYA Launch Map!
      </p>
    ),
    rejected: (
      <>
        <p>
          For some reason we were not able to verify your box and as a result, could not add it to
          the FYA Launch Map.
        </p>
        <br />
        <p>
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

  const nextStepsDict = {
    approved: [
      <li key={0}>
        Find your box on the Launch Map{' '}
        <a
          href="/"
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
          href="/"
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
        <a
          href="/"
          style={{
            'font-weight': 700,
          }}
        >
          hello@findyouranchor.us
        </a>
      </li>,
    ],
    rejected: [],
  };

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
            color: '#2E688E',
            'font-size': '24px',
            padding: '100px 0 0 0',
          }}
        >
          {headerContent}
        </h1>
        {headerSubtextContent}
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '60%',
              'padding-top': '40px',
            }}
          >
            <div
              style={{
                padding: '0 0 20px 0',
              }}
            >
              <h2
                style={{
                  'font-size': '18px',
                  'font-weight': 700,
                  color: '#2E688E',
                  'text-transform': 'uppercase',
                }}
              >
                What does this mean?
              </h2>
              {whatDoesThisMeanContent}
            </div>
            {type !== 'rejected' && (
              <div
                style={{
                  'margin-left': '10px',
                }}
              >
                <h2
                  style={{
                    'font-size': '18px',
                    'font-weight': 700,
                    color: '#2E688E',
                    'text-transform': 'uppercase',
                  }}
                >
                  Next steps:
                </h2>
                <ul
                  styles={{
                    'margin-left': '50px',
                  }}
                >
                  {nextStepsContent}
                </ul>
              </div>
            )}
          </div>
          <img style={{ width: '200px' }} src={imageSource} alt="Approved box icon" />
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
