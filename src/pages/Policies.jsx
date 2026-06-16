// pages/Policies.jsx
import { useState, useEffect } from 'react'
import { fetchPolicies } from '../api/index.js'

const ITEMS_PER_PAGE = 10

export default function Policies() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPolicies()
      .then(res => {
        if (res.success) setPolicies(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = policies.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.reg_no?.toLowerCase().includes(search.toLowerCase()) ||
      p.policy_no?.includes(search)
    const matchesFilter = filter === 'all' || p.policy_status === filter
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Policies</h1>
        <span className="badge">{policies.length} total</span>
        <span className="badge" style={{ background: '#e3f9e5', color: '#1a7f37' }}>
          {policies.filter(p => p.policy_status === 'active').length} active
        </span>
        <span className="badge" style={{ background: '#ffe3e3', color: '#c0392b' }}>
          {policies.filter(p => p.policy_status === 'expired').length} expired
        </span>
      </div>

      <div className="filters-row">
        <input
          className="search-input"
          placeholder="Search by name, reg no or policy no..."
          value={search}
          onChange={handleSearch}
        />
        <select className="filter-select" value={filter} onChange={handleFilter}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Reg No</th>
              <th>Policy No</th>
              <th>Type</th>
              <th>Vehicle</th>
              <th>Commencing</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => (
              <tr key={i}>
                <td>{startIndex + i + 1}</td>
                <td>{p.name}</td>
                <td>{p.phone_no}</td>
                <td>{p.reg_no}</td>
                <td>{p.policy_no}</td>
                <td>{p.policy_type?.toUpperCase()}</td>
                <td>{p.vehicle_type?.toUpperCase()}</td>
                <td>{p.commencing_date ? new Date(p.commencing_date).toLocaleDateString('en-KE') : '-'}</td>
                <td>{p.expiring_date ? new Date(p.expiring_date).toLocaleDateString('en-KE') : '-'}</td>
                <td>
                  <span className={`status-badge ${p.policy_status}`}>
                    {p.policy_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No policies found</div>}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} className={`page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
          ))}
          <button className="page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next →</button>
          <span className="page-info">Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
        </div>
      )}
    </div>
  )
}