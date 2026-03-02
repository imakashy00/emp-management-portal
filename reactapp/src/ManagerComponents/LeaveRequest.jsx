import React from 'react';

export default function LeaveRequest() {
  const rows = [];

  return (
    <section>
      <header>
        <h1>Leave Requests for Approval</h1>
        <div style={{ float: 'right' }}>Logout</div>
      </header>

      <table role="table" border="1">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Requested On</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5}>No data</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i}>
                <td>{r.emp}</td>
                <td>{r.type}</td>
                <td>{r.start}</td>
                <td>{r.end}</td>
                <td>{r.requestedOn}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}