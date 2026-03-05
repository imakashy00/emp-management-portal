// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError("Email and Password are required");
//     } else {
//       navigate('/home'); 
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-['Segoe_UI',sans-serif]">
//       <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
//           <h1 className="text-3xl font-bold mb-2">WorkBuddy</h1>
//           <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
//           <p className="text-sm leading-relaxed opacity-90">
//             Success at work is a journey, and the first step is managing your tasks effectively.
//           </p>
//         </div>

//         {/* Right Side: Form */}
//         <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center bg-white">
//           <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">Login</h2>
          
//           <form onSubmit={handleLogin} className="space-y-5">
//             <div className="group">
//               <label className="text-xs text-gray-500 block mb-1">Email</label>
//               <input 
//                 type="text" 
//                 placeholder="Enter your email" 
//                 className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] transition-colors text-[15px]"
//                 onChange={(e) => setEmail(e.target.value)} 
//               />
//             </div>

//             <div className="group">
//               <label className="text-xs text-gray-500 block mb-1">Password</label>
//               <input 
//                 type="password" 
//                 placeholder="Enter your password" 
//                 className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] transition-colors text-[15px]"
//                 onChange={(e) => setPassword(e.target.value)} 
//               />
//             </div>

//             {error && (
//               <p className="text-[#CC0000] text-xs mt-2 italic">{error}</p>
//             )}
            
//             <button 
//               type="submit" 
//               className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded md:rounded-lg font-bold mt-4 transition-colors cursor-pointer"
//             >
//               Login
//             </button>
            
//             <p className="text-center mt-6 text-sm text-gray-600">
//               Don't have an account?{' '}
//               <span 
//                 className="text-[#3C78D8] font-bold cursor-pointer hover:underline" 
//                 onClick={() => navigate('/signup')}
//               >
//                 Signup
//               </span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../apiConfig'; 
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and Password are required");

    try {
     
      const response = await axios.post(API_CONFIG.LOGIN, { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userName', response.data.userName);


      toast.success("Login Successful! Welcome Back!!"); 

      navigate('/home'); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error("Error Occurred")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="text-sm leading-relaxed opacity-90">Success at work is a journey, and the first step is managing your tasks effectively.</p>
        </div>
        <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group">
              <label className="text-xs text-gray-500 block mb-1">Email</label>
              <input type="text" placeholder="Enter your email" className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] text-[15px]" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="group">
              <label className="text-xs text-gray-500 block mb-1">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] text-[15px]" onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-[#CC0000] text-xs mt-2 italic">{error}</p>}
            <button type="submit" className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded md:rounded-lg font-bold mt-4 transition-colors cursor-pointer">Login</button>
            <p className="text-center mt-6 text-sm text-gray-600">Don't have an account? <span className="text-[#3C78D8] font-bold cursor-pointer hover:underline" onClick={() => navigate('/signup')}>Signup</span></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;