const BASE_URL = 'https://8080-aedeaaabddddefefcfccffeabf.premiumproject.examly.io';
console.log(BASE_URL)

const API = {
    SIGNUP: `${BASE_URL}/api/users/signup`,
    LOGIN: `${BASE_URL}/api/users/login`,
    GET_EMPLOYEES: `${BASE_URL}/api/users/getAllEmployees`,
    INVITE_MANAGER: `${BASE_URL}/api/users/inviteManager`,
    VERIFY_MANAGER: `${BASE_URL}/api/users/verifyManager`,
};

export default API;
