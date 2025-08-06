// frontend/pages/index.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientTable from "@/components/PatientTable";
import AdmitPatientForm from "@/components/AdmitPatientForm";

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/patients", {
        headers: {
          Authorization: "Bearer YOUR_TOKEN", // Replace with real token
        },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Failed to fetch patients", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (id) => {
    try {
      await axios.put(`http://localhost:8000/patients/${id}/discharge`, null, {
        headers: {
          Authorization: "Bearer YOUR_TOKEN", // Replace with real token
        },
      });
      fetchPatients();
    } catch (error) {
      console.error("Discharge failed", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏥 MediWatch – Patient Dashboard</h1>

      {/* Admit Patient Form */}
      <AdmitPatientForm onAdmit={fetchPatients} />

      {/* Loading Spinner */}
      {loading ? (
        <p className="text-gray-600 mt-4">⏳ Loading patients...</p>
      ) : (
        <PatientTable patients={patients} onDischarge={handleDischarge} />
      )}
    </div>
  );
}
