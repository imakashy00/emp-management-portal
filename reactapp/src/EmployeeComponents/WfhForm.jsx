import React, { useState } from 'react';

export default function WfhForm() {
  const [submitted, setSubmitted] = useState(false);

  const [start, setStart] = useState('');
  const [end, setEnd]     = useState('');
  const [reason, setReason] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <header>
        <h1>Apply WFH Request</h1>
        <div style={{ float: 'right' }}>Logout</div>
      </header>

      <form onSubmit={onSubmit} aria-label="wfh-form">
        <div>
          <label htmlFor="wfh-start">Start Date</label>
          <input
            id="wfh-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          {submitted && !start && <div>Start Date is required</div>}
        </div>

        <div>
          <label htmlFor="wfh-end">End Date</label>
          <input
            id="wfh-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          {submitted && !end && <div>End Date is required</div>}
        </div>

        <div>
          <label htmlFor="wfh-reason">Reason</label>
          <textarea
            id="wfh-reason"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {submitted && !reason && <div>Reason is required</div>}
        </div>

        <button type="submit">Add Request</button>
      </form>
    </div>
  );
}