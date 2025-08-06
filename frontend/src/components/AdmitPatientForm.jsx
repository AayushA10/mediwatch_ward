// frontend/components/AdmitPatientForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AdmitPatientForm = ({ onAdmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    ward: "",
    icu: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await axios.post("http://localhost:8000/patients", formData, {
        headers: {
          Authorization: "Bearer YOUR_TOKEN", // Replace or inject real token
        },
      });
      setSuccessMsg("Patient admitted successfully!");
      setFormData({ name: "", ward: "", icu: false });
      onAdmit(); // refresh patient list
    } catch (error) {
      alert("Error admitting patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4">➕ Admit New Patient</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Ward</label>
        <input
          type="text"
          name="ward"
          className="w-full px-3 py-2 border rounded"
          value={formData.ward}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="icu"
            className="mr-2"
            checked={formData.icu}
            onChange={handleChange}
          />
          ICU Required
        </label>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Admitting..." : "Admit Patient"}
      </button>

      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
    </form>
  );
};

export default AdmitPatientForm;
