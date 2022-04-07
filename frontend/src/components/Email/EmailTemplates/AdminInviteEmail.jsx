import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item } from 'react-html-email';

const AdminInviteEmail = ({ url }) => {
  return (
    <Email>
      <Item>{url}</Item>
    </Email>
  );
};

AdminInviteEmail.propTypes = {
  url: PropTypes.string.isRequired,
};

export default AdminInviteEmail;
