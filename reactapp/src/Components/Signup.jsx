import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '', email: '', mobile: '', password: '', confirmPassword: '', role: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.userName) tempErrors.userName = "User Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.mobile) tempErrors.mobile = "Mobile is required";
    if (formData.password.length < 6) tempErrors.password = "Min 6 characters required";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords match error";
    if (!formData.role) tempErrors.role = "Role is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("User Registration Successful!");
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] h-auto md:h-[680px] bg-white rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="text-sm md:text-base leading-relaxed opacity-90">
            Streamline your collaboration today.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.3] p-8 md:p-12 overflow-y-auto bg-white">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#333]">Signup</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">User Name *</label>
              <input 
                type="text" 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                onChange={(e)=>setFormData({...formData, userName:e.target.value})} 
              />
              {errors.userName && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.userName}</p>}
            </div>

            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Email *</label>
              <input 
                type="text" 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                onChange={(e)=>setFormData({...formData, email:e.target.value})} 
              />
              {errors.email && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.email}</p>}
            </div>

            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Mobile Number *</label>
              <input 
                type="number" 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onChange={(e)=>setFormData({...formData, mobile:e.target.value})} 
              />
              {errors.mobile && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.mobile}</p>}
            </div>

            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Password *</label>
              <input 
                type="password" 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                onChange={(e)=>setFormData({...formData, password:e.target.value})} 
              />
              {errors.password && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.password}</p>}
            </div>

            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Confirm Password *</label>
              <input 
                type="password" 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm"
                onChange={(e)=>setFormData({...formData, confirmPassword:e.target.value})} 
              />
              {errors.confirmPassword && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.confirmPassword}</p>}
            </div>

            <div className="group">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Role *</label>
              <select 
                className="w-full py-2 border-b-2 border-gray-200 outline-none focus:border-[#3C78D8] transition-colors text-sm bg-transparent"
                onChange={(e)=>setFormData({...formData, role:e.target.value})}
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
              {errors.role && <p className="text-[#CC0000] text-[11px] mt-1 font-medium">{errors.role}</p>}
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded font-bold text-[15px] mt-4 transition-colors cursor-pointer"
            >
              Submit
            </button>
            
            <p className="text-center mt-4 text-sm text-gray-600">
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