import { useState, useEffect } from 'react';
import { patientAPI } from '../utils/api';

export default function PatientRegistrationModal({ isOpen, onClose, onPatientSelected, mode = 'login' }) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    medical_history: ''
  });
  const [activeTab, setActiveTab] = useState('search'); // search or new

  useEffect(() => {
    if (isOpen) {
      loadPatients();
    }
  }, [isOpen]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      loadPatients();
      return;
    }

    try {
      const response = await patientAPI.search(query);
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      alert('Name and age are required');
      return;
    }

    try {
      setLoading(true);
      const response = await patientAPI.create(formData);
      if (response.data.success) {
        alert('Patient created successfully');
        onPatientSelected(response.data.data);
        handleClose();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create patient');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setFormData({ name: '', age: '', gender: '', contact: '', medical_history: '' });
    setActiveTab('search');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold">Patient Selection</h2>
          <button
            onClick={handleClose}
            className="text-2xl font-bold hover:bg-blue-700 px-3 py-1 rounded"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 font-semibold text-center ${
              activeTab === 'search'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Select Existing Patient
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 font-semibold text-center ${
              activeTab === 'new'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Register New Patient
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'search' ? (
            <>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by patient name or ID..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:border-blue-500"
              />

              {/* Patient List */}
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : patients.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => {
                        onPatientSelected(patient);
                        handleClose();
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                    >
                      <div className="font-semibold text-lg">{patient.name}</div>
                      <div className="text-sm text-gray-600">
                        ID: {patient.id} | Age: {patient.age} | {patient.gender}
                      </div>
                      {patient.contact && (
                        <div className="text-sm text-gray-600">Contact: {patient.contact}</div>
                      )}
                      {patient.medical_history && (
                        <div className="text-sm text-gray-600">History: {patient.medical_history}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No patients found</div>
              )}
            </>
          ) : (
            /* New Patient Form */
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Patient Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Age *</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Medical History</label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                  placeholder="Any medical conditions or allergies..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg"
              >
                {loading ? 'Creating...' : 'Create Patient'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
