import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig';
import { toast } from 'react-toastify'; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '', email: '', mobile: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.userName) tempErrors.userName = "User Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.mobile) tempErrors.mobile = "Mobile is required";
    if (formData.password.length < 6) tempErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords match error";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const { confirmPassword, ...submitData } = formData;
        await axios.post(API.SIGNUP, submitData);
        
      
        toast.success("User Registration Successful!"); 
        
        navigate('/login');
      } catch (err) {
       
        const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
        toast.error(errorMsg);
      }
    } else {
        // Optional: Toast if validation fails
        toast.warn("Please fix the errors in the form");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5] overflow-hidden font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] h-auto md:h-[520px] bg-white rounded-xl overflow-hidden shadow-2xl mx-4">
        
        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">WorkBuddy</h1>
          <div className="w-8 h-1 bg-[#FFD966] mb-4"></div>
          <p className="text-sm leading-relaxed opacity-90">
            Streamline your collaboration today.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.6] p-8 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#333]">Create Account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">User Name *</label>
                <input 
                  type="text" 
                  className="w-full py-1.5 border-b border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                  onChange={(e)=>setFormData({...formData, userName:e.target.value})} 
                />
                {errors.userName && <p className="text-[#CC0000] text-[10px] mt-0.5">{errors.userName}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Email *</label>
                <input 
                  type="text" 
                  className="w-full py-1.5 border-b border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                  onChange={(e)=>setFormData({...formData, email:e.target.value})} 
                />
                {errors.email && <p className="text-[#CC0000] text-[10px] mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Mobile *</label>
                <input 
                  type="number" 
                  className="w-full py-1.5 border-b border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onChange={(e)=>setFormData({...formData, mobile:e.target.value})} 
                />
                {errors.mobile && <p className="text-[#CC0000] text-[10px] mt-0.5">{errors.mobile}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Password *</label>
                <input 
                  type="password" 
                  className="w-full py-1.5 border-b border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                  onChange={(e)=>setFormData({...formData, password:e.target.value})} 
                />
                {errors.password && <p className="text-[#CC0000] text-[10px] mt-0.5">{errors.password}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Confirm Password *</label>
                <input 
                  type="password" 
                  className="w-full py-1.5 border-b border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                  onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})} 
                />
                {errors.confirmPassword && <p className="text-[#CC0000] text-[10px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-2.5 rounded font-bold text-sm mt-8 transition-colors cursor-pointer"
            >
              Submit
            </button>
            
            <p className="text-center mt-4 text-xs text-gray-500">
              Already have an account?{' '}
              <span 
                className="text-[#3C78D8] font-bold cursor-pointer hover:underline" 
                onClick={()=>navigate('/login')}
              >
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