import React, { useEffect, useState } from "react";

const PatientTable = ({ onDischarge }) => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [ward, setWard] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams();
      if (name) query.append("name", name);
      if (status) query.append("status", status);
      if (ward) query.append("ward", ward);
      query.append("page", page);
      query.append("limit", limit);

      const response = await fetch(`/api/patients/search?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch patients");

      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const handleSearch = () => {
    setPage(1); // reset to page 1
    fetchPatients();
  };

  return (
    <div className="space-y-4">
      {/* 🔍 Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All Status</option>
          <option value="admitted">Admitted</option>
          <option value="discharged">Discharged</option>
        </select>
        <select
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All Wards</option>
          <option value="ICU">ICU</option>
          <option value="General">General</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* ⏳ Loading Spinner */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* 📋 Patient Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Ward</th>
                  <th className="px-4 py-2">ICU</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Admit Time</th>
                  <th className="px-4 py-2">Discharge Time</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="text-center border-t">
                    <td className="px-4 py-2">{patient.id}</td>
                    <td className="px-4 py-2">{patient.name}</td>
                    <td className="px-4 py-2">{patient.ward}</td>
                    <td className="px-4 py-2">{patient.icu ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{patient.status}</td>
                    <td className="px-4 py-2">{new Date(patient.admit_time).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      {patient.discharge_time
                        ? new Date(patient.discharge_time).toLocaleString()
                        : "--"}
                    </td>
                    <td className="px-4 py-2">
                      {patient.status === "admitted" && (
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => onDischarge(patient.id)}
                        >
                          Discharge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientTable;
