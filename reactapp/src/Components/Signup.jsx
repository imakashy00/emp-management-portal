import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify';

// Eye Icons for Toggle
const EyeOpen = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const EyeClosed = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>;

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const inviteEmail = searchParams.get('email');

  const [formData, setFormData] = useState({
    userName: '', email: inviteEmail || '', mobile: '', password: '', confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Real-time Validation Logic ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'userName':
        if (!value) error = "User Name is required";
        break;
      case 'email':
        const emailRegex = /\S+@\S+\.\S+/;
        if (!value) error = "Email is required";
        else if (!emailRegex.test(value)) error = "Invalid email format";
        break;
      case 'mobile':
        if (!value) error = "Mobile is required";
        else if (value.length !== 10) error = "Must be 10 digits";
        break;
      case 'password':
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Min 6 characters required";
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Perform live error check
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final check for all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return toast.warn("Please fix validation errors");
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const endpoint = token ? `${API.VERIFY_MANAGER}` : API.SIGNUP;
      
      // If verifying manager, include token in body (per standard PDF flow)
      const payload = token ? { ...submitData, token } : submitData;

      await axios.post(endpoint, payload);
      toast.success(token ? "Manager Registered!" : "Account Created!");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5] overflow-hidden font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] h-auto md:h-[550px] bg-white rounded-xl overflow-hidden shadow-2xl mx-4">
        
        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">WorkBuddy</h1>
          <div className="w-8 h-1 bg-[#FFD966] mb-4"></div>
          <p className="text-sm leading-relaxed opacity-90">
            {token ? "Manager Authorization Protocol" : "Streamline your collaboration today."}
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.6] p-8 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#333]">
            {token ? "Complete Registration" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              {/* User Name */}
              <div className="md:col-span-2 group">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">User Name *</label>
                <input 
                  type="text" 
                  name="userName"
                  className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm ${errors.userName ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'}`}
                  onChange={handleInputChange} 
                />
                {errors.userName && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{errors.userName}</p>}
              </div>

              {/* Email */}
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Email *</label>
                <input 
                  type="text" 
                  name="email"
                  value={formData.email}
                  disabled={!!inviteEmail}
                  className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'} ${inviteEmail ? 'bg-gray-50' : ''}`}
                  onChange={handleInputChange} 
                />
                {errors.email && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Mobile *</label>
                <input 
                  type="number" 
                  name="mobile"
                  className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm ${errors.mobile ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'}`}
                  onChange={handleInputChange} 
                />
                {errors.mobile && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{errors.mobile}</p>}
              </div>

              {/* Password */}
              <div className="group relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Password *</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm pr-8 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'}`}
                    onChange={handleInputChange} 
                  />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1 text-gray-400 cursor-pointer hover:text-[#3C78D8]">
                    {showPassword ? <EyeClosed /> : <EyeOpen />}
                  </span>
                </div>
                {errors.password && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="group relative">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">Confirm Password *</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    name="confirmPassword"
                    className={`w-full py-1.5 border-b-2 outline-none transition-colors text-sm pr-8 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-[#3C78D8]'}`}
                    onChange={handleInputChange} 
                  />
                  <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 top-1 text-gray-400 cursor-pointer hover:text-[#3C78D8]">
                    {showConfirm ? <EyeClosed /> : <EyeOpen />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-[#CC0000] text-[10px] mt-0.5 font-semibold">{errors.confirmPassword}</p>}
              </div>

            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-2.5 rounded font-bold text-sm mt-8 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? "Registering..." : (token ? "Verify & Register" : "Submit")}
            </button>
            
            <p className="text-center mt-4 text-xs text-gray-500">
              Already have an account?{' '}
              <span className="text-[#3C78D8] font-bold cursor-pointer hover:underline" onClick={()=>navigate('/login')}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;