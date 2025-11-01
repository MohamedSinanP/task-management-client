import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from "lucide-react";
import { login, signup } from '../../apis/auth';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import type { LoginFormData, SignupFormData } from '../../types/type';



export default function AuthPages() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupFormData>();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>();

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      const res = await signup({
        name: data.username,
        email: data.email,
        password: data.password
      });

      toast.success(res.message || "Signup successful!");
      resetSignup();
      if (res.user) {
        dispatch(addAuth({
          username: res.user.name,
          email: res.user.email,
          role: res.user.role,
          id: res.user.id
        }));
      }
      if (res.user?.role === "admin") {
        navigate('/admin/projects');
      } else {
        navigate('/tasks')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const res = await login({
        email: data.email,
        password: data.password,
      });

      toast.success(res.message || "Login successful!");

      if (res.user) {
        dispatch(addAuth({
          username: res.user.name,
          email: res.user.email,
          role: res.user.role,
          id: res.user.id
        }));
      }
      if (res.user?.role === "admin") {
        navigate('/admin/projects');
      } else {
        navigate('/tasks')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };


  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetSignup();
    resetLogin();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-br from-blue-600 to-blue-700 p-8 text-white">
          <h1 className="text-3xl font-bold text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-center text-blue-100 mt-2">
            {isLogin ? 'Login to your account' : 'Sign up to get started'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {isLogin ? (
            // Login Form
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  {...registerLogin('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    {...registerLogin("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                )}
              </div>


              {/* Submit Button */}
              <button
                onClick={handleSubmitLogin(onLoginSubmit)}
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          ) : (
            // Signup Form
            <div className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  {...registerSignup('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Username must not exceed 20 characters',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="johndoe"
                />
                {signupErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{signupErrors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  {...registerSignup('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
                {signupErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{signupErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    {...registerSignup("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Password must contain uppercase, lowercase, and number",
                      },
                    })}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showSignupPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{signupErrors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitSignup(onSignupSubmit)}
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          )}

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}