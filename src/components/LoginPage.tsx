import React, { useState } from 'react';
import { useAuth, UserRole } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password, selectedRole, fullName.trim());
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">🌾</div>
        <div className="absolute top-20 right-20 text-4xl">🏘️</div>
        <div className="absolute bottom-20 left-20 text-5xl">🚜</div>
        <div className="absolute bottom-10 right-10 text-4xl">💧</div>
        <div className="absolute top-1/2 left-1/4 text-3xl">🌳</div>
        <div className="absolute top-1/3 right-1/3 text-4xl">⚡</div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌾</div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Sudarshan</h1>
            <p className="text-green-600 font-medium">Village Infrastructure Management</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'admin'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">👨‍💼</div>
                <div className="font-semibold">Administrator</div>
                <div className="text-xs opacity-75">Full Access</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'user'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold">Village User</div>
                <div className="text-xs opacity-75">Limited Access</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to Village Portal'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-sm text-green-700">
              <div className="font-semibold mb-2">Database Demo Credentials:</div>
              <div className="space-y-2 text-xs">
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium">Admin User:</div>
                  <div>Email: admin@village.gov.in</div>
                  <div>Password: admin123</div>
                </div>
                <div className="bg-white p-2 rounded border">
                  <div className="font-medium">Regular User:</div>
                  <div>Email: rajesh@village.com</div>
                  <div>Password: user123</div>
                </div>
                <div className="text-blue-600 font-medium">Or create new account with any email/password</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-green-600 text-sm">
          Empowering villages through smart infrastructure management
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
