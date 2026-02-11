import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import '../index.css';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('dummy');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-fill demo credentials
    setUsername('admin');
    setPassword('admin123');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password, mode);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('mode', mode);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-3xl font-bold text-gray-800">Medical Kiosk</h1>
          <p className="text-gray-600 mt-2">Patient Management System</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Operation Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="dummy"
                  checked={mode === 'dummy'}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 mr-2"
                  disabled={loading}
                />
                <span className="text-gray-700">Dummy (Demo)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="practical"
                  checked={mode === 'practical'}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-4 h-4 mr-2"
                  disabled={loading}
                />
                <span className="text-gray-700">Practical</span>
              </label>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mt-6 text-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Username: <span className="font-mono bg-white px-1 py-0.5 rounded">admin</span></p>
          <p>Password: <span className="font-mono bg-white px-1 py-0.5 rounded">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
