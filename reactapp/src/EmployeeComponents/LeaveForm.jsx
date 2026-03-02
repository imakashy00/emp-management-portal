import React, { useState } from 'react';

export default function LeaveForm() {
  const [submitted, setSubmitted] = useState(false);

  const [start, setStart] = useState('');
  const [end, setEnd]     = useState('');
  const [reason, setReason] = useState('');
  const [type, setType]   = useState('');
  const [file, setFile]   = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <header>
        <h1>Apply Leave Request</h1>
        {/* Make sure Logout is visible */}
        <div style={{ float: 'right' }}>Logout</div>
      </header>

      <form onSubmit={onSubmit} aria-label="leave-form">
        <div>
          <label htmlFor="lv-start">Start Date</label>
          <input
            id="lv-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          {submitted && !start && <div>Start Date is required</div>}
        </div>

        <div>
          <label htmlFor="lv-end">End Date</label>
          <input
            id="lv-end"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
          {submitted && !end && <div>End Date is required</div>}
        </div>

        <div>
          <label htmlFor="lv-reason">Reason</label>
          <textarea
            id="lv-reason"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          {submitted && !reason && <div>Reason is required</div>}
        </div>

        <div>
          <label htmlFor="lv-type">Leave Type</label>
          <select
            id="lv-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Sick">Sick</option>
            <option value="Casual">Casual</option>
            <option value="Earned">Earned</option>
          </select>
          {submitted && !type && <div>Leave Type is required</div>}
        </div>

        <div>
          <label htmlFor="lv-file">Attachment</label>
          <input
            id="lv-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {submitted && !file && <div>File is required</div>}
        </div>

        <button type="submit">Add Request</button>
      </form>
    </div>
  );
}