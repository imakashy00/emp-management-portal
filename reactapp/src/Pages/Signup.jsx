
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import Input from '../Components/Input';
import Button from '../Components/Button';
import { Eye, EyeOff, ShieldCheck, User } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const inviteEmail = searchParams.get('email');

  // Passing token and inviteEmail to hook
  const { formData, errors, loading, handleInputChange, handleSubmit } = useSignup(token, inviteEmail, navigate);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Determine if this is a Manager Registration
  const isManagerInvited = !!token;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#f0f2f5] overflow-hidden font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] h-auto md:h-[550px] bg-white rounded-xl overflow-hidden shadow-2xl mx-4">

        {/* Left Side: Branding */}
        <div className={`flex-1 ${isManagerInvited ? 'bg-gradient-to-br from-[#1C4587] to-[#0d2347]' : 'bg-gradient-to-br from-[#1C4587] to-[#3C78D8]'} text-white p-8 flex flex-col justify-center transition-colors duration-500`}>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">WorkBuddy</h1>
          <div className="w-8 h-1 bg-[#FFD966] mb-4"></div>

          <div className="flex items-center gap-2 mb-2">
            {isManagerInvited ? <ShieldCheck size={20} className="text-[#FFD966]" /> : <User size={20} />}
            <p className="text-sm font-bold uppercase tracking-widest">
              {isManagerInvited ? "Manager Portal" : "Employee Portal"}
            </p>
          </div>

          <p className="text-sm leading-relaxed opacity-90">
            {isManagerInvited
              ? "Complete your secure registration to start managing your team's requests."
              : "Streamline your collaboration and manage your work-life balance."}
          </p>
        </div>

        <div className="flex-[1.6] p-8 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-[#333] mb-1">
            {isManagerInvited ? "Manager Setup" : "Create Account"}
          </h2>
          <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-widest font-bold">
            {isManagerInvited ? `Invited: ${inviteEmail}` : "Please fill in your details"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

              <Input
                label="Full Name"
                name="userName"
                containerClass="md:col-span-2"
                error={errors.userName}
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="John Doe"
              />

              <Input
                label="Email Address"
                name="email"
                value={formData.email} // Auto-filled from URL if manager
                disabled={isManagerInvited} // Locked if manager
                error={errors.email}
                onChange={handleInputChange}
                className={isManagerInvited ? "bg-gray-50 text-gray-500" : ""}
              />

              <Input
                label="Mobile Number"
                name="mobile"
                type="number"
                error={errors.mobile}
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="10 digit mobile"
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                error={errors.password}
                icon={showPassword ? Eye : EyeOff}
                onIconClick={() => setShowPassword(!showPassword)}
                onChange={handleInputChange}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                error={errors.confirmPassword}
                icon={showConfirm ? Eye : EyeOff}
                onIconClick={() => setShowConfirm(!showConfirm)}
                onChange={handleInputChange}
              />
            </div>

            {/* Note: The 'token' is held in the useSignup hook's scope, 
                it doesn't need a visible input field as it's added to payload on submit */}

            <div className="pt-4">
              <Button type="submit" loading={loading}>
                {isManagerInvited ? "Verify & Complete Setup" : "Sign Up"}
              </Button>
            </div>

            <p className="text-center mt-4 text-xs text-gray-500">
              Already have an account?{' '}
              <span className="text-[#3C78D8] font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>
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