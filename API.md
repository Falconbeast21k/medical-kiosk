# Medical Kiosk API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "data": {},
  "message": "description"
}
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "admin123",
  "mode": "dummy"  // or "practical"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  },
  "token": "base64token",
  "mode": "dummy"
}
```

### Get Current Mode
**GET** `/auth/mode`

Response:
```json
{
  "success": true,
  "mode": "dummy"
}
```

### Change Mode
**POST** `/auth/mode`

Request:
```json
{
  "mode": "practical"
}
```

Response:
```json
{
  "success": true,
  "message": "Mode switched to practical",
  "mode": "practical"
}
```

---

## Patient Endpoints

### Get All Patients
**GET** `/patients`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "PAT-ABC12345",
      "name": "John Doe",
      "age": 45,
      "gender": "M",
      "contact": "9876543210",
      "medical_history": "Hypertension, Diabetes",
      "last_visit_date": "2025-02-10T10:30:00.000Z",
      "created_at": "2025-01-15T08:00:00.000Z"
    }
  ]
}
```

### Get Patient by ID
**GET** `/patients/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "PAT-ABC12345",
    "name": "John Doe",
    "age": 45,
    "gender": "M",
    "contact": "9876543210",
    "medical_history": "Hypertension, Diabetes",
    "last_visit_date": "2025-02-10T10:30:00.000Z",
    "vitals": [
      {
        "id": "vital-uuid",
        "bp_sys": 130,
        "bp_dia": 85,
        "pulse": 75,
        "spo2": 98.5,
        "temperature": 98.6,
        "timestamp": "2025-02-10T10:30:00.000Z"
      }
    ],
    "consultations": [
      {
        "id": "consult-uuid",
        "diagnosis": "Hypertension",
        "treatment": "Lifestyle modification",
        "date": "2025-02-10T10:30:00.000Z"
      }
    ]
  }
}
```

### Search Patients
**GET** `/patients/search/:query`

Example: `/patients/search/John`

### Create Patient
**POST** `/patients`

Request:
```json
{
  "name": "Jane Smith",
  "age": 35,
  "gender": "F",
  "contact": "9876543211",
  "medical_history": "None"
}
```

Response:
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "id": "PAT-XYZ98765",
    "name": "Jane Smith",
    "age": 35,
    "gender": "F",
    "contact": "9876543211",
    "medical_history": "None"
  }
}
```

### Update Patient
**PUT** `/patients/:id`

Request:
```json
{
  "name": "Jane Smith",
  "age": 36,
  "gender": "F",
  "contact": "9876543211",
  "medical_history": "Migraine"
}
```

---

## Vitals Endpoints

### Get Patient Vitals History
**GET** `/vitals/patient/:patientId`

Returns last 50 vitals readings ordered by most recent first.

### Get Latest Vitals
**GET** `/vitals/latest/:patientId`

Returns the most recent vital signs for a patient.

### Get Vitals Summary
**GET** `/vitals/summary/:patientId`

Returns 30-day vitals summary with averages.

Response:
```json
{
  "success": true,
  "data": {
    "total_readings": 15,
    "avg_bp_sys": 128,
    "avg_bp_dia": 82,
    "avg_pulse": 72,
    "avg_spo2": 98.2,
    "avg_temp": 98.4,
    "latest": {
      "id": "vital-uuid",
      "bp_sys": 130,
      "bp_dia": 85,
      "pulse": 75,
      "spo2": 98.5,
      "temperature": 98.6,
      "timestamp": "2025-02-10T10:30:00.000Z"
    }
  }
}
```

### Record Vital Signs
**POST** `/vitals`

Request:
```json
{
  "patient_id": "PAT-ABC12345",
  "bp_sys": 130,
  "bp_dia": 85,
  "pulse": 75,
  "spo2": 98.5,
  "temperature": 98.6
}
```

Response:
```json
{
  "success": true,
  "message": "Vital signs recorded successfully",
  "data": {
    "id": "vital-uuid",
    "patient_id": "PAT-ABC12345",
    "bp_sys": 130,
    "bp_dia": 85,
    "pulse": 75,
    "spo2": 98.5,
    "temperature": 98.6
  }
}
```

---

## Consultation Endpoints

### Get Patient Consultations
**GET** `/consultations/patient/:patientId`

Returns consultations ordered by most recent first.

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "consult-uuid",
      "patient_id": "PAT-ABC12345",
      "symptoms": ["headache", "fever"],
      "diagnosis": "Common Cold",
      "treatment": "Rest and hydration",
      "medications": ["Paracetamol 650mg TDS"],
      "advice": "Clear fluids, bland diet",
      "doctor_notes": "Patient doing well",
      "date": "2025-02-10T10:30:00.000Z"
    }
  ]
}
```

### Get Consultation by ID
**GET** `/consultations/:id`

### Create Consultation
**POST** `/consultations`

Request:
```json
{
  "patient_id": "PAT-ABC12345",
  "symptoms": ["headache", "fever"],
  "diagnosis": "Common Cold",
  "treatment": "Rest and hydration",
  "medications": ["Paracetamol 650mg TDS"],
  "advice": "Clear fluids, bland diet",
  "doctor_notes": "Prescribed rest for 3 days"
}
```

Response:
```json
{
  "success": true,
  "message": "Consultation recorded successfully",
  "data": {
    "id": "consult-uuid",
    "patient_id": "PAT-ABC12345",
    "diagnosis": "Common Cold"
  }
}
```

---

## Disease Endpoints

### Get All Diseases
**GET** `/diseases`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "disease-uuid",
      "name": "Hypertension",
      "symptoms": ["headache", "dizziness", "chest pain"],
      "vital_indicators": {
        "bp_sys": ">140",
        "bp_dia": ">90"
      },
      "medications": ["Amlodipine 5mg OD", "Lisinopril 10mg OD"],
      "advice": "Low salt diet, regular exercise, stress management",
      "followup": "2 weeks",
      "referral_triggers": ["BP >180/110", "Chest pain", "Severe headache"],
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Disease by ID
**GET** `/diseases/:id`

### Search Diseases
**GET** `/diseases/search/:query`

Example: `/diseases/search/hypertension`

---

## Settings Endpoints

### Get All Settings
**GET** `/settings`

Response:
```json
{
  "success": true,
  "data": {
    "operation_mode": "dummy",
    "timezone": "UTC",
    "language": "en"
  }
}
```

### Get Setting by Key
**GET** `/settings/:key`

Example: `/settings/operation_mode`

### Update Setting
**POST** `/settings/:key`

Request:
```json
{
  "value": "practical"
}
```

---

## Health Check

### Server Status
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-02-10T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Name and age required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "status": 401,
    "message": "Invalid credentials"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "status": 404,
    "message": "Patient not found"
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": {
    "status": 500,
    "message": "Internal Server Error",
    "details": "Error stack trace (development only)"
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Usage Examples

### Example 1: Complete Patient Consultation Flow

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","mode":"dummy"}'

# 2. Get all patients
curl http://localhost:5000/api/patients

# 3. Record vital signs
curl -X POST http://localhost:5000/api/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id":"PAT-ABC12345",
    "bp_sys":130,
    "bp_dia":85,
    "pulse":75,
    "spo2":98.5,
    "temperature":98.6
  }'

# 4. Create consultation
curl -X POST http://localhost:5000/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id":"PAT-ABC12345",
    "symptoms":["headache"],
    "diagnosis":"Migraine",
    "treatment":"Rest",
    "medications":["Aspirin 500mg"],
    "doctor_notes":"Rest for 24 hours"
  }'

# 5. Get patient history
curl http://localhost:5000/api/consultations/patient/PAT-ABC12345
```

### Example 2: Disease Lookup

```bash
# Search for disease
curl http://localhost:5000/api/diseases/search/hypertension

# Get all diseases
curl http://localhost:5000/api/diseases
```

---

## Integration Guide

### For Hardware Integration (Practical Mode):

1. Implement serial port reading
2. Parse device-specific protocols
3. POST vitals data to `/vitals` endpoint
4. Handle errors and disconnections
5. Update UI with real-time data

### WebSocket Support (Future Enhancement):

```javascript
// Placeholder for WebSocket implementation
const ws = new WebSocket('ws://localhost:5000/vitals');
ws.onmessage = (event) => {
  const vitals = JSON.parse(event.data);
  // Update UI
};
```

---

**API Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Production Ready
