import { useState, useEffect } from 'react';
import { Activity, Heart, Wind, Droplets, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { api } from '../utils/api';
import { generateVitalSigns } from '../utils/dummyDataGenerator';

export default function VitalSignsPanel({ patient }) {
  const [vitals, setVitals] = useState(null);
  const [vitalHistory, setVitalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch vitals
  useEffect(() => {
    const fetchVitals = async () => {
      try {
        setLoading(true);
        const data = await api.vitalsAPI.getLatest(patient.id);
        setVitals(data);
        
        // Fetch history for charts
        const history = await api.vitalsAPI.getByPatient(patient.id);
        setVitalHistory(history.slice(-20).reverse());
      } catch (error) {
        console.error('Error fetching vitals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [patient.id]);

  // Auto-refresh vitals
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        // In Dummy Mode, generate new data
        const newVitals = generateVitalSigns();
        setVitals(newVitals);
        
        // Add to history
        setVitalHistory(prev => [...prev.slice(-19), {
          timestamp: new Date().toLocaleTimeString(),
          ...newVitals
        }]);
      } catch (error) {
        console.error('Error refreshing vitals:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return <div className="text-center text-slate-400">Loading vitals...</div>;
  }

  if (!vitals) {
    return <div className="text-center text-slate-400">No vitals data available</div>;
  }

  // Limit decimals to 2-3 places
  const formatValue = (value, decimals = 2) => parseFloat(value).toFixed(decimals);

  // Status determination
  const getStatus = (value, min, max) => {
    if (value < min) return { status: 'low', color: 'from-blue-500 to-blue-600', icon: '↓', label: 'Low' };
    if (value > max) return { status: 'high', color: 'from-red-500 to-red-600', icon: '↑', label: 'High' };
    return { status: 'normal', color: 'from-green-500 to-emerald-600', icon: '✓', label: 'Normal' };
  };

  const bpStatus = getStatus(vitals.bp_sys, 90, 140);
  const pulseStatus = getStatus(vitals.pulse, 60, 100);
  const spo2Status = getStatus(vitals.spo2, 95, 100);
  const tempStatus = getStatus(vitals.temperature, 98.0, 99.5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Vital Signs Monitor</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time patient monitoring</p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            autoRefresh
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
          }`}
        >
          {autoRefresh ? '🔄 Live' : '⏸ Paused'}
        </button>
      </div>

      {/* Vital Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className={`bg-gradient-to-br ${bpStatus.color} p-0.5 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:scale-105`}>
          <div className="bg-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-red-500/20 text-red-300 rounded-full">
                {bpStatus.label}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Blood Pressure</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-red-400">{formatValue(vitals.bp_sys, 0)}</span>
                <span className="text-2xl text-slate-500">/</span>
                <span className="text-3xl font-bold text-red-400">{formatValue(vitals.bp_dia, 0)}</span>
                <span className="text-sm text-slate-500 ml-1">mmHg</span>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">Normal: 90/60 - 140/90</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pulse */}
        <div className={`bg-gradient-to-br ${pulseStatus.color} p-0.5 rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105`}>
          <div className="bg-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center animate-pulse">
                <Heart className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full">
                {pulseStatus.label}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Pulse Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-orange-400">{formatValue(vitals.pulse, 0)}</span>
                <span className="text-sm text-slate-500">BPM</span>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">Normal: 60-100 BPM</p>
              </div>
            </div>
          </div>
        </div>

        {/* SpO2 */}
        <div className={`bg-gradient-to-br ${spo2Status.color} p-0.5 rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105`}>
          <div className="bg-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Wind className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                {spo2Status.label}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Blood Oxygen</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-400">{formatValue(vitals.spo2, 1)}</span>
                <span className="text-sm text-slate-500">%</span>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">Normal: 95-100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className={`bg-gradient-to-br ${tempStatus.color} p-0.5 rounded-2xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105`}>
          <div className="bg-slate-800 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full">
                {tempStatus.label}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Temperature</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-amber-400">{formatValue(vitals.temperature, 2)}</span>
                <span className="text-sm text-slate-500">°F</span>
              </div>
              <div className="pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">Normal: 98.0-99.5°F</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {vitalHistory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pulse & BP Chart */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-semibold">Pulse Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={vitalHistory}>
                <defs>
                  <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }}
                  formatter={(value) => [formatValue(value, 0), 'BPM']}
                />
                <Area type="monotone" dataKey="pulse" stroke="#f97316" fill="url(#pulseGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SpO2 & Temperature Chart */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Oxygen & Temperature</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={vitalHistory}>
                <defs>
                  <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} yAxisId="left" />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#e2e8f0' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="spo2" stroke="#3b82f6" fill="url(#spo2Gradient)" />
                <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#fbbf24" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Alert System */}
      {(vitals.bp_sys > 140 || vitals.pulse > 100 || vitals.spo2 < 95 || vitals.temperature > 99.5) && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-start gap-4 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-red-400 font-semibold mb-1">Alert: Abnormal Readings Detected</h4>
            <ul className="text-red-300/80 text-sm space-y-1">
              {vitals.bp_sys > 140 && <li>• Blood Pressure elevated: {formatValue(vitals.bp_sys, 0)}/{formatValue(vitals.bp_dia, 0)} mmHg</li>}
              {vitals.pulse > 100 && <li>• Pulse rate high: {formatValue(vitals.pulse, 0)} BPM</li>}
              {vitals.spo2 < 95 && <li>• Oxygen saturation low: {formatValue(vitals.spo2, 1)}%</li>}
              {vitals.temperature > 99.5 && <li>• Temperature elevated: {formatValue(vitals.temperature, 2)}°F</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-xs text-slate-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}