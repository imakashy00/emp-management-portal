import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSignup } from './hooks/useSignup';
import Input from './components/common/Input';
import Button from './components/common/Button';
import {Eye, EyeOff} from 'lucide-react'


const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const inviteEmail = searchParams.get('email');

  const { formData, errors, loading, handleInputChange, handleSubmit } = useSignup(token, inviteEmail, navigate);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

              <Input
                label="User Name"
                name="userName"
                required
                containerClass="md:col-span-2"
                error={errors.userName}
                onChange={handleInputChange}
              />

              <Input
                label="Email"
                name="email"
                required
                value={formData.email}
                disabled={!!inviteEmail}
                error={errors.email}
                onChange={handleInputChange}
              />

              <Input
                label="Mobile"
                name="mobile"
                type="number"
                required
                error={errors.mobile}
                onChange={handleInputChange}
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                error={errors.password}
                icon={showPassword ? <Eye /> : <EyeOff />}
                onIconClick={() => setShowPassword(!showPassword)}
                onChange={handleInputChange}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                error={errors.confirmPassword}
                icon={showConfirm ? EyeClosed : EyeOpen}
                onIconClick={() => setShowConfirm(!showConfirm)}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" loading={loading}>
              {token ? "Verify & Register" : "Submit"}
            </Button>

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