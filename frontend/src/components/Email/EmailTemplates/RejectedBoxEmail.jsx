import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item } from 'react-html-email';

export default function RejectedBoxEmail({ boxHolderName, rejectionReason }) {
  return (
    <Email title="link">
      <Item> Hello {boxHolderName}, your box has been rejected! </Item>
      <Item> {rejectionReason} </Item>
    </Email>
  );
}

RejectedBoxEmail.propTypes = {
  boxHolderName: PropTypes.string.isRequired,
  rejectionReason: PropTypes.string.isRequired,
};
