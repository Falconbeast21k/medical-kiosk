import { useState, useEffect } from 'react';
import { diseaseAPI, consultationAPI } from '../utils/api';

export default function ConsultationModule({ patientId, mode }) {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [allDiseases, setAllDiseases] = useState([]);
  const [suggestedDiagnosis, setSuggestedDiagnosis] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadDiseases();
  }, []);

  const loadDiseases = async () => {
    try {
      const response = await diseaseAPI.getAll();
      if (response.data.success) {
        setAllDiseases(response.data.data);
      }
    } catch (error) {
      console.error('Error loading diseases:', error);
    }
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.toLowerCase()]);
      setSymptomInput('');
      
      // Auto-suggest diagnosis when symptoms are added
      suggestDiagnosis([...symptoms, symptomInput.toLowerCase()]);
    }
  };

  const suggestDiagnosis = (symptomsArray) => {
    // Find diseases matching the symptoms
    const matches = allDiseases.filter(disease => {
      const diseaseSymptoms = disease.symptoms || [];
      return symptomsArray.some(symptom => 
        diseaseSymptoms.some(ds => ds.toLowerCase().includes(symptom) || symptom.includes(ds.toLowerCase()))
      );
    });

    if (matches.length > 0) {
      setSuggestedDiagnosis(matches[0]);
    }
  };

  const handleRemoveSymptom = (index) => {
    const newSymptoms = symptoms.filter((_, i) => i !== index);
    setSymptoms(newSymptoms);
    if (suggestedDiagnosis && newSymptoms.length === 0) {
      setSuggestedDiagnosis(null);
    }
  };

  const handleSubmitConsultation = async () => {
    if (!suggestedDiagnosis) {
      alert('Please select or suggest a diagnosis first');
      return;
    }

    try {
      setLoading(true);
      await consultationAPI.create({
        patient_id: patientId,
        symptoms: symptoms,
        diagnosis: suggestedDiagnosis.name,
        treatment: suggestedDiagnosis.advice,
        medications: suggestedDiagnosis.medications,
        doctor_notes: doctorNotes
      });

      setSubmitted(true);
      setTimeout(() => {
        setSymptoms([]);
        setDoctorNotes('');
        setSuggestedDiagnosis(null);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6">Consultation Module</h2>

      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ Consultation saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Symptoms */}
        <div>
          <h3 className="font-bold text-lg mb-3">Symptoms</h3>

          {/* Symptom Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
              placeholder="Enter symptom (e.g., headache)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddSymptom}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Add
            </button>
          </div>

          {/* Symptoms List */}
          <div className="flex flex-wrap gap-2 mb-4">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                <span>{symptom}</span>
                <button
                  onClick={() => handleRemoveSymptom(index)}
                  className="font-bold cursor-pointer hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Doctor Notes */}
          <h3 className="font-bold text-lg mb-2 mt-4">Doctor Notes</h3>
          <textarea
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="Additional observations and notes..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            rows={4}
          />
        </div>

        {/* Right Column: Diagnosis & Treatment */}
        <div>
          {suggestedDiagnosis ? (
            <>
              <h3 className="font-bold text-lg mb-3 text-blue-600">
                Suggested Diagnosis
              </h3>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                <div className="font-bold text-xl mb-3">{suggestedDiagnosis.name}</div>

                {/* Medications */}
                <div className="mb-4">
                  <h4 className="font-semibold text-green-700 mb-2">💊 Medications</h4>
                  <ul className="space-y-1 text-sm">
                    {suggestedDiagnosis.medications?.map((med, i) => (
                      <li key={i} className="text-gray-700">
                        • {med}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Advice */}
                <div className="mb-4">
                  <h4 className="font-semibold text-blue-700 mb-2">💡 Lifestyle Advice</h4>
                  <p className="text-sm text-gray-700">{suggestedDiagnosis.advice}</p>
                </div>

                {/* Follow-up */}
                <div className="mb-4">
                  <h4 className="font-semibold text-purple-700 mb-2">📅 Follow-up</h4>
                  <p className="text-sm text-gray-700">{suggestedDiagnosis.followup}</p>
                </div>

                {/* Referral Triggers */}
                {suggestedDiagnosis.referral_triggers?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2">⚠️ Doctor Referral Triggers</h4>
                    <ul className="space-y-1 text-sm">
                      {suggestedDiagnosis.referral_triggers.map((trigger, i) => (
                        <li key={i} className="text-red-600">
                          • {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
              <p>Add symptoms to see suggested diagnosis</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitConsultation}
        disabled={loading || !suggestedDiagnosis}
        className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg"
      >
        {loading ? 'Saving Consultation...' : 'Save Consultation'}
      </button>
    </div>
  );
}
