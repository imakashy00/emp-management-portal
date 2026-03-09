
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useForgotPassword } from '../hooks/useForgotPassword';
import Input from './Input';
import Button from './Button';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    formData,
    loading,
    handleInputChange,
    handleCheckEmail,
    handleUpdatePassword
  } = useForgotPassword(navigate);

  const onEmailSubmit = async (e) => {
    e.preventDefault();
    const success = await handleCheckEmail();
    if (success) setStep(2);
  };

  const onResetSubmit = async (e) => {
    e.preventDefault();
    await handleUpdatePassword();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="opacity-90">
            {step === 1 ? "Verify your email to receive a security code." : "Enter the code and set your new password."}
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">
            {step === 1 ? "Account Recovery" : "Reset Password"}
          </h2>

          {step === 1 ? (
            <form onSubmit={onEmailSubmit} className="space-y-6">
              <Input
                label="Registered Email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
              />
              <Button type="submit" loading={loading}>Send OTP Code</Button>
            </form>
          ) : (
            <form onSubmit={onResetSubmit} className="space-y-4">
              <Input
                label="6-Digit OTP"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength="6"
                value={formData.otp}
                onChange={handleInputChange}
                icon={ShieldCheck}
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                icon={showPass ? EyeOff : Eye}
                onIconClick={() => setShowPass(!showPass)}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                icon={showConfirm ? EyeOff : Eye}
                onIconClick={() => setShowConfirm(!showConfirm)}
                required
              />
              <Button type="submit" loading={loading}>Update Password</Button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-blue-600 hover:underline"
              >
                Back to Email
              </button>
            </form>
          )}

          <p className="text-center mt-6 text-sm">
            Remembered? <span onClick={() => navigate('/login')} className="text-[#3C78D8] font-bold cursor-pointer">Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;