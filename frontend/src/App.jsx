import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [showDashboard, setShowDashboard] = useState(false);

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
    notes: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {

    const response = await fetch("http://localhost:5000/api/leads");

    const data = await response.json();

    setLeads(data);
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    await fetch("http://localhost:5000/api/leads/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    fetchLeads();

    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "New",
      notes: "",
    });
  };

  const deleteLead = async (id) => {

    await fetch(`http://localhost:5000/api/leads/${id}`, {
      method: "DELETE",
    });

    fetchLeads();
  };

  const updateStatus = async (id, currentStatus) => {

    let newStatus = "New";

    if (currentStatus === "New") {
      newStatus = "Contacted";
    } else if (currentStatus === "Contacted") {
      newStatus = "Interested";
    } else if (currentStatus === "Interested") {
      newStatus = "Closed";
    }

    await fetch(`http://localhost:5000/api/leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    fetchLeads();
  };

  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalLeads = leads.length;

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const closedLeads = leads.filter(
    (lead) => lead.status === "Closed"
  ).length;

  if (!showDashboard) {
    return (
      <div className="landing-page">

        <h1>LeadFlow CRM</h1>

        <p>Smart Lead Management System</p>

        <button
          className="start-btn"
          onClick={() => setShowDashboard(true)}
        >
          Next
        </button>

      </div>
    );
  }

  return (
    <div className="container">

      <h1>LeadFlow CRM Dashboard</h1>

      <div className="stats-container">

        <div className="card">
          <h2>{totalLeads}</h2>
          <p>Total Leads</p>
        </div>

        <div className="card">
          <h2>{interestedLeads}</h2>
          <p>Interested</p>
        </div>

        <div className="card">
          <h2>{closedLeads}</h2>
          <p>Closed</p>
        </div>

      </div>

      <form onSubmit={handleSubmit} className="form-box">

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">
          Add Lead
        </button>

      </form>

      <div className="filter-section">

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Interested</option>
          <option>Closed</option>
        </select>

      </div>

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredLeads.map((lead) => (

            <tr key={lead._id}>

              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.phone}</td>

              <td>
                <span className={`status ${lead.status}`}>
                  {lead.status}
                </span>
              </td>

              <td>{lead.notes}</td>

              <td>

                <button
                  onClick={() => updateStatus(lead._id, lead.status)}
                >
                  Update
                </button>

                <button
                  onClick={() => deleteLead(lead._id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;