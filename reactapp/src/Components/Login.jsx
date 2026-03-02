
import React, { useState } from 'react';

export default function Login() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={onSubmit} aria-label="login-form">
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {submitted && !email && <div>Email is required</div>}
        </div>

        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {submitted && !password && <div>Password is required</div>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
