// pages/Client.jsx
import { useState, useEffect } from 'react'
import { fetchClients } from '../api/index.js'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchClients()
      .then(res => {
        if (res.success) setClients(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_no?.includes(search) ||
    c.reg_no?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Clients</h1>
        <span className="badge">{clients.length} total</span>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, phone or reg no..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Reg No</th>
              <th>Policy No</th>
              <th>Type</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Client Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.phone_no}</td>
                <td>{c.reg_no}</td>
                <td>{c.policy_no}</td>
                <td>{c.policy_type?.toUpperCase()}</td>
                <td>
                  <span className={`status-badge ${c.policy_status}`}>
                    {c.policy_status}
                  </span>
                </td>
                <td>{c.expiring_date ? new Date(c.expiring_date).toLocaleDateString('en-KE') : '-'}</td>
                <td>
                  <span className={`status-badge ${c.client_type}`}>
                    {c.client_type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty">No clients found</div>
        )}
      </div>
    </div>
  )
}