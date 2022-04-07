import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item } from 'react-html-email';

export default function PendingChangesBoxEmail({ boxHolderName, changesRequested }) {
  return (
    <Email title="link">
      <Item> Hello {boxHolderName}, we require some additional information about your box! </Item>
      <Item> {changesRequested} </Item>
    </Email>
  );
}

PendingChangesBoxEmail.propTypes = {
  boxHolderName: PropTypes.string.isRequired,
  changesRequested: PropTypes.string.isRequired,
};
