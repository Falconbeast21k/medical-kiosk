import { useState, useEffect } from 'react';
import { vitalsAPI } from '../utils/api';
import DummyDataGenerator from '../utils/dummyDataGenerator';

export default function VitalSignsPanel({ patientId, mode }) {
  const [vitals, setVitals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadVitals();

    // Auto-refresh every 5 seconds in practical mode, 3 seconds in dummy mode
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadVitals, mode === 'practical' ? 5000 : 3000);
    }

    return () => clearInterval(interval);
  }, [patientId, mode, autoRefresh]);

  const loadVitals = async () => {
    try {
      setLoading(true);

      let vitalData;
      if (mode === 'dummy') {
        // Generate dummy data with delay simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        vitalData = DummyDataGenerator.generateVitals();
      } else {
        // Fetch from API
        const response = await vitalsAPI.getLatest(patientId);
        vitalData = response.data.data;
      }

      setVitals(vitalData);
    } catch (error) {
      console.error('Error loading vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVitalStatus = (value, type) => {
    if (!value) return 'unknown';

    switch (type) {
      case 'bp_sys':
        if (value >= 140) return 'critical';
        if (value >= 130) return 'warning';
        return 'normal';
      case 'bp_dia':
        if (value >= 90) return 'critical';
        if (value >= 80) return 'warning';
        return 'normal';
      case 'pulse':
        if (value >= 100 || value <= 60) return value < 40 ? 'critical' : 'warning';
        return 'normal';
      case 'spo2':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'normal';
      case 'temperature':
        if (value >= 100.4) return 'critical';
        if (value >= 99.5) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'normal':
        return '✓';
      case 'warning':
        return '⚠';
      case 'critical':
        return '✕';
      default:
        return '?';
    }
  };

  const VitalCard = ({ title, value, unit, type }) => {
    const status = getVitalStatus(value, type);
    const colorClass = getStatusColor(status);

    return (
      <div className={`border-2 rounded-lg p-4 ${colorClass}`}>
        <div className="text-sm font-semibold opacity-75">{title}</div>
        <div className="text-3xl font-bold mt-2">{value ?? '—'}</div>
        <div className="text-xs opacity-75 mt-1">{unit}</div>
        <div className="mt-2 text-xs font-semibold">
          {getStatusIcon(status)} {status.toUpperCase()}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vital Signs Monitoring</h2>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 mr-2"
            />
            <span className="text-sm font-semibold">Auto-refresh</span>
          </label>
          <button
            onClick={loadVitals}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mb-4 text-sm text-gray-600">
        {mode === 'dummy' ? '🔄 DUMMY MODE (Simulated Data)' : '🔗 PRACTICAL MODE'}
        {loading && ' - Loading...'}
      </div>

      {/* Vitals Grid */}
      {vitals ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <VitalCard
            title="Blood Pressure"
            value={vitals.bp_sys ? `${vitals.bp_sys}/${vitals.bp_dia}` : '—'}
            unit="mmHg"
            type="bp_sys"
          />
          <VitalCard
            title="Pulse"
            value={vitals.pulse}
            unit="BPM"
            type="pulse"
          />
          <VitalCard
            title="Oxygen (SpO2)"
            value={vitals.spo2}
            unit="%"
            type="spo2"
          />
          <VitalCard
            title="Temperature"
            value={vitals.temperature}
            unit="°F"
            type="temperature"
          />
          <VitalCard
            title="Status"
            value={vitals.timestamp ? new Date(vitals.timestamp).toLocaleTimeString() : 'N/A'}
            unit="Time"
            type="unknown"
          />
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {loading ? 'Loading vital signs...' : 'No vital signs recorded'}
        </div>
      )}

      {/* Color Legend */}
      <div className="mt-6 pt-4 border-t flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
}
