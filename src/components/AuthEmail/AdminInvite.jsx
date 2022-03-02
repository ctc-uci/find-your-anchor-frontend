import React, { useState } from 'react';
import { sendInviteLink } from '../../common/auth_utils';

const AdminInvite = () => {
  const [email, setEmail] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await sendInviteLink(email);
      setConfirmationMessage(`A reset password email has been sent to ${email}`);
      setErrorMessage('');
      setEmail('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Invite New User</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="Email"
        />
        <br />
        <button type="submit">Send Email</button>
      </form>
      {confirmationMessage && <p>{confirmationMessage}</p>}
    </div>
  );
};

export default AdminInvite;
