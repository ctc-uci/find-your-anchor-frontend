import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item } from 'react-html-email';

export default function MyEmail({ name }) {
  return (
    <Email title="link">
      <Item> Hello {name}, your box has been approved! </Item>
    </Email>
  );
}

MyEmail.propTypes = {
  name: PropTypes.string.isRequired,
};
