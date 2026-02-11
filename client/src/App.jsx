import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import PatientModal from './components/PatientModal';
import VitalSignsPanel from './components/VitalSignsPanel';
import ConsultationModule from './components/ConsultationModule';
import HistoryAndReports from './components/HistoryAndReports';
import './index.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('dummy');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedMode = localStorage.getItem('mode');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setMode(savedMode || 'dummy');
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);

      const timer = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000); // 5 minutes

      setInactivityTimer(timer);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [isAuthenticated, inactivityTimer]);

  const handleLoginSuccess = (response) => {
    setUser(response.user);
    setMode(response.mode);
    setIsAuthenticated(true);
    setShowPatientModal(true);
  };

  const handlePatientSelected = (patient) => {
    setCurrentPatient(patient);
    setShowPatientModal(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mode');
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPatient(null);
    setShowPatientModal(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">🏥 Medical Kiosk</h1>
            <span className="bg-blue-800 px-3 py-1 rounded text-sm font-semibold">
              {mode.toUpperCase()} MODE
            </span>
          </div>

          {currentPatient && (
            <div className="text-right">
              <p className="font-semibold">{currentPatient.name}</p>
              <p className="text-sm text-blue-100">ID: {currentPatient.id}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPatientModal(true)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
            >
              {currentPatient ? 'Change Patient' : 'Select Patient'}
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Patient Modal */}
      <PatientModal
        isOpen={showPatientModal && isAuthenticated}
        onClose={() => {
          if (currentPatient) setShowPatientModal(false);
        }}
        onPatientSelected={handlePatientSelected}
        mode={showPatientModal && !currentPatient ? 'login' : 'select'}
      />

      {/* Main Content */}
      {currentPatient && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Patient ID</p>
                <p className="font-bold text-lg">{currentPatient.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Age</p>
                <p className="font-bold text-lg">{currentPatient.age}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Gender</p>
                <p className="font-bold text-lg">{currentPatient.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Contact</p>
                <p className="font-bold text-lg">{currentPatient.contact || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Visit</p>
                <p className="font-bold text-lg">
                  {currentPatient.last_visit_date
                    ? new Date(currentPatient.last_visit_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            {currentPatient.medical_history && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Medical History:</strong> {currentPatient.medical_history}
                </p>
              </div>
            )}
          </div>

          {/* Vital Signs Panel */}
          <VitalSignsPanel patientId={currentPatient.id} mode={mode} />

          {/* Consultation Module */}
          <ConsultationModule patientId={currentPatient.id} mode={mode} />

          {/* History & Reports */}
          <HistoryAndReports
            patientId={currentPatient.id}
            patientName={currentPatient.name}
          />

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 text-sm border-t pt-6">
            <p>
              Medical Kiosk System • {mode.toUpperCase()} Mode • Last updated:{' '}
              {new Date().toLocaleTimeString()}
            </p>
            <p className="text-xs mt-2">
              For emergency: Contact your doctor immediately
            </p>
          </footer>
        </main>
      )}
    </div>
  );
}
