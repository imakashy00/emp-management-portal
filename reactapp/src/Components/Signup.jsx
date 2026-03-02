import React, { useState } from 'react';

export default function Signup() {
  const [submitted, setSubmitted] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail]       = useState('');
  const [mobile, setMobile]     = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const showMismatch = submitted && password && confirm && password !== confirm;

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={onSubmit} aria-label="signup-form">
        <div>
          <label htmlFor="su-name">User Name</label>
          <input
            id="su-name"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {submitted && !userName && <div>User Name is required</div>}
        </div>

        <div>
          <label htmlFor="su-email">Email</label>
          <input
            id="su-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {submitted && !email && <div>Email is required</div>}
        </div>

        <div>
          <label htmlFor="su-mobile">Mobile Number</label>
          <input
            id="su-mobile"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {submitted && !mobile && <div>Mobile Number is required</div>}
        </div>

        <div>
          <label htmlFor="su-password">Password</label>
          <input
            id="su-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {submitted && !password && <div>Password is required</div>}
        </div>

        <div>
          <label htmlFor="su-confirm">Confirm Password</label>
          <input
            id="su-confirm"
            placeholder="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {submitted && !confirm && <div>Confirm Password is required</div>}
        </div>

        {showMismatch && <div>Passwords do not match</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}