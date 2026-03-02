import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import store from '../store';
import Login from '../Components/Login';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Signup from '../Components/Signup';
import ErrorPage from '../Components/ErrorPage';
import HomePage from '../Components/HomePage';
import EmployeeNavbar from '../EmployeeComponents/EmployeeNavbar';
import LeaveForm from "../EmployeeComponents/LeaveForm"
import ViewLeave from '../EmployeeComponents/ViewLeave';
import ViewWfh from '../EmployeeComponents/ViewWfh';
import WfhForm from "../EmployeeComponents/WfhForm"
import ManagerNavbar from '../ManagerComponents/ManagerNavbar';
import LeaveRequest from '../ManagerComponents/LeaveRequest';
import WfhRequest from '../ManagerComponents/WfhRequest';

jest.mock('axios');

// Setup QueryClient
const queryClient = new QueryClient();

describe('Login Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Login {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  
  test('frontend_login_component_renders_the_with_login_heading', () => {
    renderLoginComponent();

  
    const loginHeadings = screen.getAllByText(/Login/i);
    expect(loginHeadings.length).toBeGreaterThan(0);

  });


  test('frontend_login_component_displays_validation_messages_when_login_button_is_clicked_with_empty_fields', () => {
    renderLoginComponent();

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

   
});
describe('Signup Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderSignupComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Signup {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_signup_component_renders_with_signup_heading', () => {
    renderSignupComponent();

    const signupHeadings = screen.getAllByText(/Signup/i);
   expect(signupHeadings.length).toBeGreaterThan(0);

  });

  test('frontend_signup_component_displays_validation_messages_when_submit_button_is_clicked_with_empty_fields', () => {
    renderSignupComponent();

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('User Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Mobile Number is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
  });

  test('frontend_signup_component_displays_error_when_passwords_do_not_match', () => {
    renderSignupComponent();

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
describe('ErrorPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderErrorComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ErrorPage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_errorpage_component_renders_with_error_heading', () => {
    renderErrorComponent();
    const headingElement = screen.getByText(/Oops! Something Went Wrong/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('frontend_errorpage_component_renders_with_error_content', () => {
    renderErrorComponent();
    const paragraphElement = screen.getByText(/Please try again later./i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
describe('Home Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderHomeComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <HomePage {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };
  test('frontend_home_component_renders_with_heading', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/WorkBuddy/i);
    expect(headingElement.length).toBeGreaterThan(0);

  });
  test('frontend_home_component_renders_with_contact_us', () => {
    renderHomeComponent();
    const headingElement = screen.getAllByText(/Contact Us/i);
    expect(headingElement.length).toBeGreaterThan(0);

  });


});
describe('EmployeeNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderEmployeeNavbarComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <EmployeeNavbar {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_employee_navbar_component_renders_with_home', () => {
    renderEmployeeNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_employee_navbar_component_renders_with_wfh', () => {
    renderEmployeeNavbarComponent();
    const WFH = screen.getAllByText('WFH');
    expect(WFH.length).toBeGreaterThan(0);
  });

  test('frontend_employee_navbar_component_renders_with_logout', () => {
    renderEmployeeNavbarComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});
describe('LeaveForm Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLeaveFormComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LeaveForm {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_leave_form_component_displays_error_when_submitting_with_empty_title', () => {
    renderLeaveFormComponent();

    fireEvent.click(screen.getByRole('button', { name: /Add Request/i }));

    expect(screen.getByText('Start Date is required')).toBeInTheDocument();
    expect(screen.getByText('End Date is required')).toBeInTheDocument();
    expect(screen.getByText('Reason is required')).toBeInTheDocument();
    expect(screen.getByText('Leave Type is required')).toBeInTheDocument();
    expect(screen.getByText('File is required')).toBeInTheDocument();
  });


  test('frontend_leave_form_component_renders_with_apply_leave_request_heading', () => {
    renderLeaveFormComponent();

    const course = screen.getByText('Apply Leave Request');
    expect(course).toBeInTheDocument();
  });

  test('frontend_leave_form_component_renders_with_logout', () => {
    renderLeaveFormComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});
describe('ViewLeave Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderViewLeaveComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ViewLeave {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_view_leave_component_renders_with_table', () => {
    renderViewLeaveComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_view_leave_component_renders_with_logout', () => {
  renderViewLeaveComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_view_leave_component_renders_with_heading', () => {
    renderViewLeaveComponent();
    // Check table data cells
    const heading = screen.getAllByText('Leave Requests');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});
describe('ViewWFH Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderViewWfhComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ViewWfh {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_view_wfh_component_renders_with_table', () => {
    renderViewWfhComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_view_wfh_component_renders_with_logout', () => {
  renderViewWfhComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_view_wfh_component_renders_with_heading', () => {
    renderViewWfhComponent();
    // Check table data cells
    const heading = screen.getAllByText('Work From Home Requests');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});
describe('WfhForm Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWfhFormComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <WfhForm {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_wfh_form_component_displays_error_when_submitting_with_empty_title', () => {
    renderWfhFormComponent();

    fireEvent.click(screen.getByRole('button', { name: /Add Request/i }));

    expect(screen.getByText('Start Date is required')).toBeInTheDocument();
    expect(screen.getByText('End Date is required')).toBeInTheDocument();
    expect(screen.getByText('Reason is required')).toBeInTheDocument();

  });


  test('frontend_wfh_form_component_renders_with_apply_wfh_request_heading', () => {
    renderWfhFormComponent();

    const course = screen.getByText('Apply WFH Request');
    expect(course).toBeInTheDocument();
  });

  test('frontend_wfh_form_component_renders_with_logout', () => {
    renderWfhFormComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});
describe('ManagerNavbar Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderManagerNavbarComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ManagerNavbar {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_manager_navbar_component_renders_with_home', () => {
    renderManagerNavbarComponent();
    const home = screen.getAllByText('Home');
    expect(home.length).toBeGreaterThan(0);
  });

  test('frontend_manager_navbar_component_renders_with_wfh_request', () => {
    renderManagerNavbarComponent();
    const WFH = screen.getAllByText('WFH Request');
    expect(WFH.length).toBeGreaterThan(0);
  });

  test('frontend_manager_navbar_component_renders_with_logout', () => {
    renderManagerNavbarComponent();
  
    const logout = screen.getAllByText('Logout');
    expect(logout.length).toBeGreaterThan(0);
  });

});
describe('LeaveRequest Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLeaveRequestComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <LeaveRequest {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_leave_request_component_renders_with_table', () => {
    renderLeaveRequestComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_leave_request_component_renders_with_logout', () => {
  renderLeaveRequestComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_leave_request_component_renders_with_heading', () => {
    renderLeaveRequestComponent();
    // Check table data cells
    const heading = screen.getAllByText('Leave Requests for Approval');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});
describe('WfhRequest Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWfhRequestComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <WfhRequest {...props} />
          </Router>
        </QueryClientProvider>
      </Provider>
    );
  };

  test('frontend_wfh_request_component_renders_with_table', () => {
    renderWfhRequestComponent();

    const tableElement = screen.getByRole('table');
    expect(tableElement).toBeInTheDocument();
 });

 
 test('frontend_wfh_request_component_renders_with_logout', () => {
  renderWfhRequestComponent();

  const logout = screen.getAllByText('Logout');
  expect(logout.length).toBeGreaterThan(0);
});

  test('frontend_wfh_request_component_renders_with_heading', () => {
    renderWfhRequestComponent();
    // Check table data cells
    const heading = screen.getAllByText('WFH Requests for Approval');
    expect(heading.length).toBeGreaterThan(0); // Check if there are any table data cells rendered
  });

});