// pages/Renewals.jsx
import { useState, useEffect } from 'react'
import { fetchRenewals, fetchPendingRenewals } from '../api/index.js'

const ITEMS_PER_PAGE = 10

export default function Renewals() {
  const [overdue, setOverdue] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overdue')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    Promise.all([fetchRenewals(), fetchPendingRenewals()])
      .then(([ov, pend]) => {
        if (ov.success) setOverdue(ov.data)
        if (pend.success) setPending(pend.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const data = activeTab === 'overdue' ? overdue : pending

  const filtered = data.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.reg_no?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone_no?.includes(search)
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleTab = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearch('')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Renewals</h1>
        <span className="badge" style={{ background: '#ffe3e3', color: '#c0392b' }}>
          {overdue.length} overdue
        </span>
        <span className="badge" style={{ background: '#fff3e3', color: '#d35400' }}>
          {pending.length} pending requests
        </span>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => handleTab('overdue')}
        >
          Overdue Renewals
        </button>
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => handleTab('pending')}
        >
          Pending Requests
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, reg no or phone..."
        value={search}
        onChange={handleSearch}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            {activeTab === 'overdue' ? (
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Reg No</th>
                <th>Policy No</th>
                <th>Expired On</th>
                <th>Overdue Since</th>
              </tr>
            ) : (
              <tr>
                <th>#</th>
                <th>Phone</th>
                <th>Reg No</th>
                <th>Status</th>
                <th>Requested</th>
              </tr>
            )}
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              activeTab === 'overdue' ? (
                <tr key={i}>
                  <td>{startIndex + i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.phone_no}</td>
                  <td>{r.reg_no}</td>
                  <td>{r.policy_no}</td>
                  <td>{r.expiring_date ? new Date(r.expiring_date).toLocaleDateString('en-KE') : '-'}</td>
                  <td>{r.overdue_since ? new Date(r.overdue_since).toLocaleDateString('en-KE') : '-'}</td>
                </tr>
              ) : (
                <tr key={i}>
                  <td>{startIndex + i + 1}</td>
                  <td>{r.phone_no}</td>
                  <td>{r.reg_no}</td>
                  <td><span className={`status-badge ${r.status}`}>{r.status}</span></td>
                  <td>{r.requested_at ? new Date(r.requested_at).toLocaleDateString('en-KE') : '-'}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No records found</div>}
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