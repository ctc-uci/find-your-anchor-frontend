import React from 'react';
import PropTypes from 'prop-types';
import { Email } from 'react-html-email';

const AdminInviteEmail = ({ url, senderName }) => {
  return (
    <Email style={{ float: 'left' }}>
      <p style={{ color: 'black' }}>Hi,</p>
      <p style={{ color: 'black' }}>
        {senderName} is inviting you to register for the Find Your Anchor Launch Map. Please click
        the link below to create an account using your Find Your Anchor email address.
      </p>
      <p style={{ color: 'black' }}>
        <a href={url}>Registration Link</a>
      </p>
      <p style={{ color: 'black' }}>
        Thank you,
        <br />
        Find Your Anchor
      </p>
    </Email>
  );
};

AdminInviteEmail.propTypes = {
  url: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
};

export default AdminInviteEmail;
