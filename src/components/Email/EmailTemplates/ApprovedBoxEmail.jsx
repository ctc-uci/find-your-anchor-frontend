import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item } from 'react-html-email';

export default function ApprovedBoxEmail({ boxHolderName }) {
  return (
    <Email title="link">
      <Item> Hello {boxHolderName}, your box has been approved! </Item>
    </Email>
  );
}

ApprovedBoxEmail.propTypes = {
  boxHolderName: PropTypes.string.isRequired,
};
