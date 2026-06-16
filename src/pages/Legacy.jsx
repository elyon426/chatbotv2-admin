import { useState, useEffect } from 'react'
import { fetchLegacy } from '../api/index.js'

const ITEMS_PER_PAGE = 10  // -- how many rows per page

export default function Legacy() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchLegacy()
      .then(res => {
        if (res.success) setClients(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // -- PAGINATION LOGIC EXPLAINED:
  // -- 1. Filter first (search narrows down the list)
  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.reg_no?.toLowerCase().includes(search.toLowerCase()) ||
    c.policy_no?.includes(search)
  )

  // -- 2. Calculate total pages
  // -- e.g. 59 clients / 10 per page = 5.9 → Math.ceil = 6 pages
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  // -- 3. Slice the array for current page
  // -- page 1: slice(0, 10)   → items 0-9
  // -- page 2: slice(10, 20)  → items 10-19
  // -- page 3: slice(20, 30)  → items 20-29
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // -- 4. Reset to page 1 when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Legacy Clients</h1>
        <span className="badge">{clients.length} total</span>
        <span className="badge" style={{ background: '#fff3e3', color: '#d35400' }}>
          {clients.filter(c => c.migrated).length} migrated
        </span>
        <span className="badge" style={{ background: '#ffe3e3', color: '#c0392b' }}>
          {clients.filter(c => !c.migrated).length} not migrated
        </span>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, reg no or policy no..."
        value={search}
        onChange={handleSearch}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Reg No</th>
              <th>Policy No</th>
              <th>Class</th>
              <th>PAX</th>
              <th>Premium</th>
              <th>Expiry</th>
              <th>Phone</th>
              <th>Migrated</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c, i) => (
              <tr key={c.id}>
                <td>{startIndex + i + 1}</td>
                <td>{c.name}</td>
                <td>{c.reg_no}</td>
                <td>{c.policy_no}</td>
                <td>{c.vehicle_class}</td>
                <td>{c.pax}</td>
                <td>KES {Number(c.premium).toLocaleString()}</td>
                <td>{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-KE') : '-'}</td>
                <td>{c.phone_no || <span style={{ color: '#c0392b' }}>Not set</span>}</td>
                <td>
                  <span className={`status-badge ${c.migrated ? 'active' : 'expired'}`}>
                    {c.migrated ? 'Yes' : 'No'}
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

      {/* -- PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* -- Previous button */}
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {/* -- Page number buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          {/* -- Next button */}
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>

          <span className="page-info">
            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}
    </div>
  )
}