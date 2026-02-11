import { useState, useEffect } from 'react';
import { vitalsAPI, consultationAPI } from '../utils/api';

export default function HistoryAndReports({ patientId, patientName }) {
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [activeTab, setActiveTab] = useState('vitals');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vitalsRes, consultRes] = await Promise.all([
        vitalsAPI.getByPatient(patientId),
        consultationAPI.getByPatient(patientId)
      ]);

      if (vitalsRes.data.success) {
        setVitalsHistory(vitalsRes.data.data);
      }
      if (consultRes.data.success) {
        setConsultations(consultRes.data.data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    // Simple PDF generation - can be enhanced with html2pdf library
    const doc = document.createElement('div');
    doc.innerHTML = `
      <h1>Medical Report - ${patientName}</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      
      <h2>Recent Consultations</h2>
      ${consultations.map(c => `
        <div>
          <p><strong>Date:</strong> ${new Date(c.date).toLocaleDateString()}</p>
          <p><strong>Diagnosis:</strong> ${c.diagnosis}</p>
          <p><strong>Treatment:</strong> ${c.treatment}</p>
          <hr/>
        </div>
      `).join('')}
    `;

    // In production, use html2pdf library
    alert('PDF export feature would be implemented here using html2pdf library');
  };

  const downloadCSV = () => {
    if (vitalsHistory.length === 0) {
      alert('No data to export');
      return;
    }

    let csv = 'Date,Time,BP Sys,BP Dia,Pulse,SpO2,Temperature\n';
    vitalsHistory.forEach(vital => {
      const date = new Date(vital.timestamp);
      csv += `${date.toLocaleDateString()},${date.toLocaleTimeString()},${vital.bp_sys},${vital.bp_dia},${vital.pulse},${vital.spo2},${vital.temperature}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitals_${patientName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">History & Reports</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'vitals'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Vitals History
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'consultations'
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Consultations
        </button>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={downloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold"
        >
          📄 Download PDF
        </button>
        <button
          onClick={downloadCSV}
          disabled={vitalsHistory.length === 0}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
        >
          📊 Download CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : activeTab === 'vitals' ? (
        // Vitals History
        <div className="overflow-x-auto">
          {vitalsHistory.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="px-4 py-2 text-left">Date & Time</th>
                  <th className="px-4 py-2 text-right">BP (mmHg)</th>
                  <th className="px-4 py-2 text-right">Pulse (BPM)</th>
                  <th className="px-4 py-2 text-right">SpO2 (%)</th>
                  <th className="px-4 py-2 text-right">Temp (°F)</th>
                </tr>
              </thead>
              <tbody>
                {vitalsHistory.map((vital, idx) => {
                  const date = new Date(vital.timestamp);
                  return (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{date.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">
                        {vital.bp_sys}/{vital.bp_dia}
                      </td>
                      <td className="px-4 py-2 text-right">{vital.pulse}</td>
                      <td className="px-4 py-2 text-right">{vital.spo2}</td>
                      <td className="px-4 py-2 text-right">
                        {vital.temperature?.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No vitals recorded yet
            </div>
          )}
        </div>
      ) : (
        // Consultations
        <div className="space-y-4">
          {consultations.length > 0 ? (
            consultations.map((consult, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{consult.diagnosis}</h4>
                  <span className="text-sm text-gray-600">
                    {new Date(consult.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Treatment:</strong> {consult.treatment}
                </p>
                {consult.doctor_notes && (
                  <p className="text-sm text-gray-700">
                    <strong>Doctor Notes:</strong> {consult.doctor_notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No consultations recorded yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
