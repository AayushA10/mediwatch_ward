import React, { useEffect, useState } from "react";
import { getWardStatus } from "../services/api";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { CSVLink } from "react-csv";
import PatientForm from "../components/PatientForm";
import PatientTable from "../components/PatientTable";
import axios from "axios";

const statusColor = {
  Normal: "#16a34a",
  Warning: "#facc15",
  Critical: "#dc2626",
};

const Dashboard = () => {
  const [wards, setWards] = useState([]);
  const [patients, setPatients] = useState([]);
  const [wardFilter, setWardFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("admit_desc");

  const fetchWardStatus = () => {
    getWardStatus()
      .then((res) => setWards(res.data))
      .catch((err) => console.error("Error fetching ward status:", err));
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleDischarge = async (id) => {
    await axios.put(`http://localhost:8000/api/patients/${id}/discharge`);
    fetchPatients();
    fetchWardStatus();
  };

  useEffect(() => {
    fetchWardStatus();
    fetchPatients();
    const interval = setInterval(() => {
      fetchWardStatus();
      fetchPatients();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const csvHeaders = [
    { label: "Ward", key: "ward" },
    { label: "Occupied Beds", key: "occupied" },
    { label: "Total Beds", key: "total" },
    { label: "Occupancy %", key: "occupancy_percent" },
    { label: "Status", key: "status" },
    { label: "Action", key: "action" },
  ];

  const total = patients.length;
  const admitted = patients.filter((p) => p.status === "admitted").length;
  const discharged = patients.filter((p) => p.status === "discharged").length;

  const summaryChart = {
    labels: ["Total", "Admitted", "Discharged"],
    datasets: [
      {
        label: "Patient Count",
        data: [total, admitted, discharged],
        backgroundColor: ["#0ea5e9", "#16a34a", "#6b7280"],
      },
    ],
  };

  const filteredPatients = patients
    .filter((p) => {
      const wardMatch = wardFilter === "All" || p.ward === wardFilter;
      const statusMatch = statusFilter === "All" || p.status === statusFilter;
      const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return wardMatch && statusMatch && nameMatch;
    })
    .sort((a, b) => {
      const timeA = new Date(a[sortOrder.startsWith("admit") ? "admit_time" : "discharge_time"]);
      const timeB = new Date(b[sortOrder.startsWith("admit") ? "admit_time" : "discharge_time"]);
      return sortOrder.endsWith("asc") ? timeA - timeB : timeB - timeA;
    });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        🏥 Ward Occupancy Dashboard
      </h2>

      <PatientForm />

      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f1f5f9",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          📊 Patient Summary
        </h3>
        <Bar data={summaryChart} options={{ responsive: true }} />
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <label>Ward: </label>
          <select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
            <option value="All">All</option>
            {Array.from(new Set(patients.map((p) => p.ward))).map((ward) => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Status: </label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="admitted">Admitted</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
        <div>
          <label>Sort By: </label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="admit_desc">Admit Time ↓</option>
            <option value="admit_asc">Admit Time ↑</option>
            <option value="discharge_desc">Discharge Time ↓</option>
            <option value="discharge_asc">Discharge Time ↑</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="🔍 Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "220px",
            }}
          />
        </div>
      </div>

      <div style={{ margin: "2rem 0" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          📋 Filtered Patients
        </h3>
        <PatientTable patients={filteredPatients} onDischarge={handleDischarge} />
      </div>

      <CSVLink
        data={wards}
        headers={csvHeaders}
        filename={"ward_status_report.csv"}
        style={{
          background: "#2563eb",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "8px",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "1.5rem",
        }}
      >
        ⬇️ Export CSV
      </CSVLink>

      {wards.map((ward, index) => (
        <div
          key={index}
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#f9f9f9",
          }}
        >
          <h3 style={{ fontSize: "1.5rem" }}>{ward.ward}</h3>
          <p>
            Status:{" "}
            <strong style={{ color: statusColor[ward.status] }}>
              {ward.status}
            </strong>
          </p>

          <Bar
            data={{
              labels: ["Occupied Beds", "Available Beds"],
              datasets: [
                {
                  label: "Bed Count",
                  data: [ward.occupied, ward.total - ward.occupied],
                  backgroundColor: [statusColor[ward.status], "#e5e7eb"],
                },
              ],
            }}
            options={{ indexAxis: "y", responsive: true }}
          />

          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            {ward.action}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
