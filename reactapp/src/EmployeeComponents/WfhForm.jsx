import React from 'react';
import Form from '../EmployeeComponents/Form';

const WfhForm = () => {
  return (
    <div className="flex-1 p-10 bg-[#f4f7f6] min-h-screen flex items-center justify-center">
      <Form type="WFH" />
    </div>
  );
};

export default WfhForm;