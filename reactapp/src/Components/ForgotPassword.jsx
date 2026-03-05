import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../apiConfig'; 
import { toast } from 'react-toastify';

// Eye Icons
const EyeOpen = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const EyeClosed = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Toggle states
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email) return toast.warn("Please enter your email");

    setLoading(true);
    try {
      const processedEmail = email.trim().toLowerCase();
      await axios.post(API.CHECK_EMAIL, { email: processedEmail });
      
      // Clear password states to ensure a clean field
      setNewPassword('');
      setConfirmPassword('');
      
      setIsVerified(true);
      toast.info("Account verified! Enter your new password.");
    } catch (err) {
      const msg = err.response?.data?.message || "Email not found in our records";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.warn("Please fill all fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const processedEmail = email.trim().toLowerCase();
      await axios.put(API.RESET_PASSWORD, { email: processedEmail, newPassword });
      toast.success("Password Updated Successfully!");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl">
        
        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-white">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="text-sm leading-relaxed opacity-90 text-white font-medium">
            {isVerified ? "Choose a strong password to secure your account." : "Verify your registered email to reset your account password."}
          </p>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">
            {isVerified ? "Reset Password" : "Account Recovery"}
          </h2>
          
          {!isVerified ? (
            <form onSubmit={handleCheckEmail} className="space-y-6">
              <div className="group">
                <label className="text-xs text-gray-500 block mb-1">Registered Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full py-2 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] text-[15px]" 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded md:rounded-lg font-bold mt-4 transition-colors cursor-pointer">
                {loading ? "Checking..." : "Verify Email"}
              </button>
            </form>
          ) : (
            /* STEP 2 FORM: ANTI-AUTOFILL + EYE TOGGLE */
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="group relative">
                <label className="text-xs text-gray-500 block mb-1">New Password</label>
                <input 
                  type={showPass ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={newPassword}
                  readOnly // ANTI-AUTOFILL
                  onFocus={(e) => e.target.removeAttribute('readOnly')} // UNLOCK ON CLICK
                  className="w-full py-2 pr-10 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] text-[15px]" 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
                <span onClick={() => setShowPass(!showPass)} className="absolute right-0 bottom-2 text-gray-400 cursor-pointer hover:text-[#3C78D8]">
                   {showPass ? <EyeClosed /> : <EyeOpen />}
                </span>
              </div>

              <div className="group relative">
                <label className="text-xs text-gray-500 block mb-1">Confirm New Password</label>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  readOnly // ANTI-AUTOFILL
                  onFocus={(e) => e.target.removeAttribute('readOnly')} // UNLOCK ON CLICK
                  className="w-full py-2 pr-10 border-b-2 border-gray-100 outline-none focus:border-[#3C78D8] text-[15px]" 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
                <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 bottom-2 text-gray-400 cursor-pointer hover:text-[#3C78D8]">
                   {showConfirm ? <EyeClosed /> : <EyeOpen />}
                </span>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#1C4587] hover:bg-[#153669] text-white py-3 rounded md:rounded-lg font-bold mt-4 transition-colors cursor-pointer">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm text-gray-600">
            Remembered your password? <span className="text-[#3C78D8] font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;