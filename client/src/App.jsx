import { useState, useEffect } from 'react';
import { LogOut, Activity, Zap, Heart, AlertCircle, Menu, X, TrendingUp } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import PatientModal from './components/PatientModal';
import VitalSignsPanel from './components/VitalSignsPanel';
import ConsultationModule from './components/ConsultationModule';
import HistoryAndReports from './components/HistoryAndReports';
import { api } from './utils/api';
import './index.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Auto-logout after 30 minutes
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      if (Date.now() - lastActivityTime > 30 * 60 * 1000) {
        handleLogout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoggedIn, lastActivityTime]);

  const handleLogin = async (credentials) => {
    try {
      const response = await api.authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setIsLoggedIn(true);
      setLastActivityTime(Date.now());
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mode');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setSelectedPatient(null);
    setActiveTab('dashboard');
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Floating Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo & Branding */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Medical Kiosk
                </h1>
                <p className="text-xs text-cyan-400/70">Enterprise Edition</p>
              </div>
            </div>

            {/* Center Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {['dashboard', 'consultation', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium capitalize ${
                    activeTab === tab
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Patient Info */}
              {selectedPatient && (
                <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedPatient.name}</p>
                    <p className="text-xs text-slate-400">Age: {selectedPatient.age}</p>
                  </div>
                </div>
              )}

              {/* Patient Selector */}
              <button
                onClick={() => setShowPatientModal(true)}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                <Zap className="w-4 h-4" />
                <span>Select Patient</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg text-slate-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700/50 py-4 space-y-2 animate-fade-in">
              {['dashboard', 'consultation', 'history'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all capitalize"
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowPatientModal(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
              >
                Select Patient
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!selectedPatient ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-cyan-500/20">
                <Activity className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-4xl font-bold text-white">No Patient Selected</h2>
              <p className="text-slate-400 text-lg max-w-md">
                Please select a patient to begin monitoring vital signs and managing consultations.
              </p>
              <button
                onClick={() => setShowPatientModal(true)}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                Select Patient
              </button>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  <VitalSignsPanel patient={selectedPatient} />
                </div>
              )}

              {/* Consultation Tab */}
              {activeTab === 'consultation' && (
                <div className="animate-fade-in">
                  <ConsultationModule patient={selectedPatient} />
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="animate-fade-in">
                  <HistoryAndReports patient={selectedPatient} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Patient Modal */}
      {showPatientModal && (
        <PatientModal
          onSelect={handleSelectPatient}
          onClose={() => setShowPatientModal(false)}
        />
      )}
    </div>
  );
}