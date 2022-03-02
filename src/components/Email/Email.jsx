import React from 'react';
import PropTypes from 'prop-types';
import { Email, Item, A } from 'react-html-email';

export default function MyEmail({ name }) {
  return (
    <Email title="link">
      <Item>
        Hello {name}
        <A style={{ paddingLeft: 10 }} href="/blog/">
          Click me!
        </A>
      </Item>
    </Email>
  );
}

MyEmail.propTypes = {
  name: PropTypes.string.isRequired,
};
