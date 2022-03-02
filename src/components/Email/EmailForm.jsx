import React, { useState } from 'react';
import { renderEmail } from 'react-html-email';
import { FYABackend } from '../../common/utils';
import MyEmail from './Email';

function EmailForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    const messageHtml = renderEmail(<MyEmail name={name}> {feedback}</MyEmail>);
    FYABackend.post('/nodemailer/send', {
      name,
      email,
      messageHtml,
    }).then(response => {
      if (response.data.msg === 'success') {
        alert('Email sent, awesome!');
        setFeedback('');
      } else if (response.data.msg === 'fail') {
        alert('Oops, something went wrong. Try again');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Enter your name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label htmlFor="email">
        Enter your email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <input type="submit" />
    </form>
  );
}

export default EmailForm;
