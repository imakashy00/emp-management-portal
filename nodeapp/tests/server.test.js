const userController = require('../controllers/userController');
const User = require('../models/userModel');
const { validateToken } = require('../authUtils');
const LeaveRequest = require('../models/leaveRequestModel');
const mongoose = require('mongoose');
const WfhRequest = require('../models/wfhRequestModel');
const { getLeaveRequestById, addLeaveRequest, updateLeaveRequest } = require('../controllers/leaveRequestController');
const { updateWfhRequest, addWfhRequest, getWfhRequestById } = require('../controllers/wfhRequestController');

describe('User_Model_Test', () => {
  test('backend_usermodel_should_validate_a_user_with_all_required_fields', async () => {
    const validUserData = {
      userName: 'validUserName',
      email: 'validemail@gmail.com',
      mobile: '9876543212',
      password: 'validpassword',
      role: 'user'
    };

    const user = new User(validUserData);

    await expect(user.validate()).resolves.toBeUndefined();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_username', async () => {
    const invalidUserData = {
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      password: 'validpassword',
      role: 'user'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_email', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      mobile: '9876543212',
      password: 'validpassword',
      role: 'user'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_mobile', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      password: 'validpassword',
      role: 'user'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_password', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      role: 'user'
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });

  test('backend_usermodel_should_validate_a_user_with_missing_role', async () => {
    const invalidUserData = {
      userName: 'validUserName',
      email: 'demouser@gmail.com',
      mobile: '9876543212',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    await expect(user.validate()).rejects.toThrowError();
  });
});
describe('LeaveRequest_Model_Test', () => {
  test('backend_leaverequestmodel_should_validate_a_leave_request_with_all_required_fields', async () => {
    const validLeaveRequestData = {
      userId: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Vacation',
      leaveType: 'Annual',
      status: 'Pending',
      file: 'document.pdf'
    };

    const leaveRequest = new LeaveRequest(validLeaveRequestData);

    await expect(leaveRequest.validate()).resolves.toBeUndefined();
  });

  test('backend_leaverequestmodel_should_throw_error_if_userid_is_missing', async () => {
    const invalidLeaveRequestData = {
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Vacation',
      leaveType: 'Annual',
      status: 'Pending',
      file: 'document.pdf'
    };

    const leaveRequest = new LeaveRequest(invalidLeaveRequestData);

    await expect(leaveRequest.validate()).rejects.toThrowError();
  });

  test('backend_leaverequestmodel_should_throw_error_if_startdate_is_missing', async () => {
    const invalidLeaveRequestData = {
      userId:new  mongoose.Types.ObjectId(),
      endDate: new Date(),
      reason: 'Vacation',
      leaveType: 'Annual',
      status: 'Pending',
      file: 'document.pdf'
    };

    const leaveRequest = new LeaveRequest(invalidLeaveRequestData);

    await expect(leaveRequest.validate()).rejects.toThrowError();
  });

});
describe('WfhRequest_Model_Test', () => {
  test('backend_wfhrequestmodel_should_validate_a_wfh_request_with_all_required_fields', async () => {
    const validWfhRequestData = {
      userId: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Work from home',
      status: 'Pending'
    };

    const wfhRequest = new WfhRequest(validWfhRequestData);

    await expect(wfhRequest.validate()).resolves.toBeUndefined();
  });

  test('backend_wfhrequestmodel_should_throw_error_if_userid_is_missing', async () => {
    const invalidWfhRequestData = {
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Work from home',
      status: 'Pending'
    };

    const wfhRequest = new WfhRequest(invalidWfhRequestData);

    await expect(wfhRequest.validate()).rejects.toThrowError();
  });

  test('backend_wfhrequestmodel_should_throw_error_if_startdate_is_missing', async () => {
    const invalidWfhRequestData = {
      userId: new mongoose.Types.ObjectId(),
      endDate: new Date(),
      reason: 'Work from home',
      status: 'Pending'
    };

    const wfhRequest = new WfhRequest(invalidWfhRequestData);

    await expect(wfhRequest.validate()).rejects.toThrowError();
  });

});
describe('getLeaveRequestById_Test', () => {
  test('backend_getleaverequestbyid_in_leaverequestcontroller_should_return_200_status_code_when_leave_request_found', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: leaveRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    LeaveRequest.findById = jest.fn().mockResolvedValue({ _id: leaveRequestId });

    await getLeaveRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_getleaverequestbyid_in_leaverequestcontroller_should_return_404_status_code_when_leave_request_not_found', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: leaveRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    LeaveRequest.findById = jest.fn().mockResolvedValue(null);

    await getLeaveRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('backend_getleaverequestbyid_in_leaverequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: leaveRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findById function to throw an error
    LeaveRequest.findById = jest.fn().mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await getLeaveRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe('addLeaveRequest_Test', () => {
  test('backend_addleaverequest_in_leaverequestcontroller_should_return_200_status_code_when_leave_request_added_successfully', async () => {
    const req = { body: {   
      userId: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      reason: 'Vacation',
      leaveType: 'Annual',
      status: 'Pending',
      file: 'document.pdf'
    } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Mocking the create function to resolve successfully
    LeaveRequest.create = jest.fn().mockResolvedValue(req.body);
    await addLeaveRequest(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });


  test('backend_addleaverequest_in_leaverequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking the create function to throw an error
    LeaveRequest.create = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await addLeaveRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
describe('updateLeaveRequest_Test', () => {
  test('backend_updateleaverequest_in_leaverequestcontroller_should_return_200_status_code_when_leave_request_updated_successfully', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId();
    const req = { 
      params: { id: leaveRequestId },
      body: {   
        userId: new mongoose.Types.ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Updated Vacation',
        leaveType: 'Updated Annual',
        status: 'Updated Pending',
        file: 'updated_document.pdf'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to resolve successfully
    LeaveRequest.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

    await updateLeaveRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_updateleaverequest_in_leaverequestcontroller_should_return_404_status_code_when_leave_request_not_found', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId();
    const req = { params: { id: leaveRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to return null
    LeaveRequest.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateLeaveRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('backend_updateleaverequest_in_leaverequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const leaveRequestId = new mongoose.Types.ObjectId();
    const req = { params: { id: leaveRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to throw an error
    LeaveRequest.findByIdAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await updateLeaveRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe('getWfhRequestById_Test', () => {
  test('backend_getwfhrequestbyid_in_wfhrequestcontroller_should_return_200_status_code_when_wfh_request_found', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: wfhRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    WfhRequest.findById = jest.fn().mockResolvedValue({ _id: wfhRequestId });

    await getWfhRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_getwfhrequestbyid_in_wfhrequestcontroller_should_return_404_status_code_when_wfh_request_not_found', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: wfhRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    WfhRequest.findById = jest.fn().mockResolvedValue(null);

    await getWfhRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('backend_getwfhrequestbyid_in_wfhrequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId(); 
    const req = { params: { id: wfhRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findById function to throw an error
    WfhRequest.findById = jest.fn().mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await getWfhRequestById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe('addWfhRequest_Test', () => {
  test('backend_addwfhrequest_in_wfhrequestcontroller_should_return_200_status_code_when_WFH_request_added_successfully', async () => {
    const req = { body: {   
      userId: new mongoose.Types.ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      reason: 'WFH Reason',
      status: 'Pending'
    } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking the create function to resolve successfully
    WfhRequest.create = jest.fn().mockResolvedValue(req.body);

    await addWfhRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_addwfhrequest_in_wfhrequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking the create function to throw an error
    WfhRequest.create = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await addWfhRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe('updateWfhRequest_Test', () => {
  test('backend_updatewfhrequest_in_wfhrequestcontroller_should_return_200_status_code_when_wfh_request_updated_successfully', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId();
    const req = { 
      params: { id: wfhRequestId },
      body: {   
        userId: new mongoose.Types.ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        reason: 'Updated WFH Reason',
        status: 'Updated Pending'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to resolve successfully
    WfhRequest.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);

    await updateWfhRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_updatewfhrequest_in_wfhrequestcontroller_should_return_404_status_code_when_wfh_request_not_found', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId();
    const req = { params: { id: wfhRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to return null
    WfhRequest.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await updateWfhRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('backend_updatewfhrequest_in_wfhrequestcontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const wfhRequestId = new mongoose.Types.ObjectId();
    const req = { params: { id: wfhRequestId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mocking findByIdAndUpdate function to throw an error
    WfhRequest.findByIdAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    await updateWfhRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
describe('getUserByEmailAndPassword_Test', () => {
  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_200_status_code_when_user_found', async () => {
    const req = { 
      body: {   
        email: 'test@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const user = {
      userName: 'TestUser',
      role: 'user',
      _id: new mongoose.Types.ObjectId()
    };
    User.findOne = jest.fn().mockResolvedValue(user);

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      userName: user.userName,
      role: user.role,
      token: expect.any(String),
      id: user._id
    });
  });
  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_404_status_code_when_user_not_found', async () => {
    const req = { 
      body: {   
        email: 'nonexistent@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.findOne = jest.fn().mockResolvedValue(null);

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('backend_getuserbyemailandpassword_in_usercontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { 
      body: {   
        email: 'test@example.com',
        password: 'password123'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.findOne = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await userController.getUserByEmailAndPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
describe('addUser_Test', () => {
  test('backend_add_user_in_usercontroller_should_return_200_status_code_when_user_added_successfully', async () => {
    const req = { 
      body: {   
        userName: 'NewUser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        mobile:'9876543212'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.create = jest.fn().mockResolvedValue(req.body);

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('backend_add_user_in_usercontroller_should_return_500_status_code_when_internal_server_error_occurs', async () => {
    const req = { 
      body: {   
        userName: 'NewUser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        mobile:'9876544321'
      } 
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    User.create = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    await userController.addUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
  describe('validateToken', () => {
 
    test('backend_validatetoken_function_in_authutils_should_respond_with_400_status_for_invalidtoken', () => {
      // Mock the req, res, and next objects
      const req = {
        header: jest.fn().mockReturnValue('invalidToken'),
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      // Call the validateToken function
      validateToken(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('backend_validatetoken_function_in_authutils_should_respond_with_400_status_for_no_token', () => {
      // Mock the req, res, and next objects
      const req = {
        header: jest.fn().mockReturnValue(null),
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
  
      // Call the validateToken function
      validateToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });