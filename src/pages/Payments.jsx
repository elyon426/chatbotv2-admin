// pages/Payments.jsx
import { useState, useEffect } from 'react'
import { fetchPayments } from '../api/index.js'

const ITEMS_PER_PAGE = 10

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchPayments()
      .then(res => {
        if (res.success) setPayments(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = payments.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.reg_no?.toLowerCase().includes(search.toLowerCase()) ||
    p.mpesa_code?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payments</h1>
        <span className="badge">{payments.length} total</span>
        <span className="badge" style={{ background: '#e3f9e5', color: '#1a7f37' }}>
          KES {totalAmount.toLocaleString()} total
        </span>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, reg no or mpesa code..."
        value={search}
        onChange={handleSearch}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Reg No</th>
              <th>Policy No</th>
              <th>Mpesa Code</th>
              <th>Amount</th>
              <th>Date</th>
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
                <td>{p.mpesa_code}</td>
                <td>KES {Number(p.amount).toLocaleString()}</td>
                <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-KE') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">No payments found</div>}
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