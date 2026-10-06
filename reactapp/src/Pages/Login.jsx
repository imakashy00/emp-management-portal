import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Input from '../Components/Input';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    formData,
    errors,
    serverError,
    loading,
    handleInputChange,
    handleLogin
  } = useLogin(navigate);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4 font-['Segoe_UI',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-[800px] min-h-[480px] bg-white rounded-xl overflow-hidden shadow-2xl">

        {/* Left Side: Branding */}
        <div className="flex-1 bg-gradient-to-br from-[#1C4587] to-[#3C78D8] text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2">WorkBuddy</h1>
          <div className="w-10 h-1 bg-[#FFD966] mb-5"></div>
          <p className="text-sm leading-relaxed opacity-90">
            Success at work is a journey, and the first step is managing your tasks effectively.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="flex-[1.2] p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-bold text-center mb-8 text-[#333]">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">

            <Input
              label="Email"
              name="email"
              type="text"
              placeholder="Enter your email"
              value={formData.email}
              error={errors.email}
              onChange={handleInputChange}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                error={errors.password}
                icon={showPassword ? EyeOff : Eye}
                onIconClick={() => setShowPassword(!showPassword)}
                onChange={handleInputChange}
              />

              <div className="text-right mt-1">
                <span
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] text-[#3C78D8] cursor-pointer hover:underline font-bold"
                >
                  Forgot Password?
                </span>
              </div>
            </div>

            {serverError && (
              <p className="text-[#CC0000] text-xs mt-2 italic font-bold bg-red-50 p-2 rounded border border-red-100">
                {serverError}
              </p>
            )}

            <Button type="submit" loading={loading} className="py-3 md:rounded-lg">
              Login
            </Button>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don't have an account? {' '}
              <span
                className="text-[#3C78D8] font-bold cursor-pointer hover:underline"
                onClick={() => navigate('/signup')}
              >
                Signup
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;