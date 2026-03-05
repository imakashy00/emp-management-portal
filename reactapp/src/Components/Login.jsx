import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../apiConfig'; 
import { toast } from 'react-toastify';

// Eye Icons for Toggle
const EyeOpen = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const EyeClosed = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error States for typing check
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');

  // --- Regex & Validation Logic ---
  const validateEmail = (val) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!val) return "Email is required";
    if (!emailRegex.test(val)) return "Please enter a valid email format";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // --- Real-time typing handlers ---
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setFieldErrors(prev => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setFieldErrors(prev => ({ ...prev, password: validatePassword(val) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Final check before sending to server
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    if (eErr || pErr) {
      setFieldErrors({ email: eErr, password: pErr });
      return toast.warn("Please fix validation errors");
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await axios.post(API_CONFIG.LOGIN, { 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      localStorage.clear();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userName', response.data.userName);

      toast.success("Login Successful! Welcome Back!!"); 
      navigate('/home'); 
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid Credentials";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="text-sm leading-relaxed opacity-90">Success at work is a journey, and the first step is managing your tasks effectively.</p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* EMAIL FIELD */}
            <div className="group">
              <label className="text-xs text-gray-500 block mb-1">Email</label>
              <input 
                type="text" 
                value={email}
                placeholder="Enter your email" 
                className={`w-full py-2 border-b-2 outline-none transition-colors text-[15px] ${fieldErrors.email ? 'border-red-500' : 'border-gray-100 focus:border-[#3C78D8]'}`} 
                onChange={handleEmailChange} 
              />
              {fieldErrors.email && <p className="text-[#CC0000] text-[10px] mt-1 font-semibold">{fieldErrors.email}</p>}
            </div>

            {/* PASSWORD FIELD WITH EYE TOGGLE */}
            <div className="group relative">
              <label className="text-xs text-gray-500 block mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  placeholder="Enter your password" 
                  className={`w-full py-2 border-b-2 outline-none transition-colors text-[15px] pr-10 ${fieldErrors.password ? 'border-red-500' : 'border-gray-100 focus:border-[#3C78D8]'}`} 
                  onChange={handlePasswordChange} 
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-0 top-2 cursor-pointer text-gray-400 hover:text-[#3C78D8]"
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </span>
              </div>
              {fieldErrors.password && <p className="text-[#CC0000] text-[10px] mt-1 font-semibold">{fieldErrors.password}</p>}
              
              <div className="text-right mt-2">
                <span onClick={() => navigate('/forgot-password')} className="text-[11px] text-[#3C78D8] cursor-pointer hover:underline font-bold">Forgot Password?</span>
              </div>
            </div>

            {serverError && <p className="text-[#CC0000] text-xs mt-2 italic font-bold bg-red-50 p-2 rounded">{serverError}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded md:rounded-lg font-bold mt-4 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
            
            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account? <span className="text-[#3C78D8] font-bold cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Signup</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;