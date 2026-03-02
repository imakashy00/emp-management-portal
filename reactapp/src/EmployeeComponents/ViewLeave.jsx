import React from 'react';

export default function ViewLeave() {
  const rows = [];

  return (
    <section>
      <header>
        <h1>Leave Requests</h1>
        <div style={{ float: 'right' }}>Logout</div>
      </header>

      <table role="table" border="1">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
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
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}