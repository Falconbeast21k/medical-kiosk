import { useState } from 'react';
import { Lock, Mail, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(credentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30 animate-bounce">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Medical Kiosk
            </h1>
            <p className="text-slate-400 text-sm">Enterprise Edition</p>
            <p className="text-slate-500 text-xs mt-3">Professional Healthcare Management</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/50 transition-all duration-300"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-700/50 transition-all duration-300"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2 font-semibold">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-slate-400">
              <p>👤 Username: <span className="text-cyan-400">admin</span></p>
              <p>🔐 Password: <span className="text-cyan-400">admin123</span></p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400 text-center">
              🔒 Secure Enterprise Login | All data encrypted
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-500">Featuring Advanced Medical Analytics</p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
            <span>✓ Real-time Monitoring</span>
            <span>•</span>
            <span>✓ Secure Access</span>
            <span>•</span>
            <span>✓ Live Charts</span>
          </div>
        </div>
      </div>
    </div>
  );
}