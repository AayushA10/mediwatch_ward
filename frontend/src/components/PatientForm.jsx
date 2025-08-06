import React, { useState } from "react";
import axios from "axios";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    ward: "",
    icu: false,
    status: "admitted",
    admit_time: new Date().toISOString(),
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/patients", formData);
      setMessage("✅ Patient admitted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to admit patient.");
    }
  };

  return (
    <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "10px", background: "#f0f9ff" }}>
      <h3>➕ Admit Patient</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="id" type="number" placeholder="Patient ID" value={formData.id} onChange={handleChange} required />
        <input name="name" type="text" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="ward" type="text" placeholder="Ward (e.g., ICU, General)" value={formData.ward} onChange={handleChange} required />
        <label>
          <input name="icu" type="checkbox" checked={formData.icu} onChange={handleChange} /> ICU Patient?
        </label>
        <button type="submit" style={{ background: "#16a34a", color: "#fff", padding: "8px", border: "none", borderRadius: "5px" }}>
          Admit
        </button>
      </form>
      {message && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
};

export default PatientForm;
