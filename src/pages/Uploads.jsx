import { useState, useEffect } from 'react'
import { fetchUploads } from '../api/index.js'

const ITEMS_PER_PAGE = 10  // -- how many rows per page

export default function Uploads() {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchUploads()
      .then(res => {
        if (res.success) setUploads(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // -- PAGINATION LOGIC
  const filtered = uploads.filter(u =>
    u.doc_type?.toLowerCase().includes(search.toLowerCase()) ||
    u.uploaded_by?.toLowerCase().includes(search.toLowerCase()) ||
    u.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.liaison_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.checksum?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Uploads</h1>
        <span className="badge">{uploads.length} total</span>
        <span className="badge" style={{ background: '#e8f8f5', color: '#1a7a5a' }}>
          {uploads.filter(u => u.processed).length} processed
        </span>
        <span className="badge" style={{ background: '#fef9e7', color: '#b7950b' }}>
          {uploads.filter(u => !u.processed).length} pending
        </span>
      </div>

      <input
        className="search-input"
        placeholder="Search by doc type, uploaded by, client, liaison or checksum..."
        value={search}
        onChange={handleSearch}
      />

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Document Type</th>
              <th>Uploaded By</th>
              <th>Client</th>
              <th>Liaison</th>
              <th>Checksum</th>
              <th>Status</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u, i) => (
              <tr key={u.id}>
                <td>{startIndex + i + 1}</td>
                <td>
                  <span className={`doc-badge ${u.doc_type}`}>
                    {u.doc_type?.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>{u.uploaded_by}</td>
                <td>{u.client_name || <span style={{ color: '#7f8c8d' }}>N/A</span>}</td>
                <td>{u.liaison_name || <span style={{ color: '#7f8c8d' }}>N/A</span>}</td>
                <td>
                  <span className="checksum" title={u.checksum}>
                    {u.checksum?.substring(0, 10)}...
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${u.processed ? 'active' : 'pending'}`}>
                    {u.processed ? 'Processed' : 'Pending'}
                  </span>
                </td>
                <td>{new Date(u.uploaded_at).toLocaleString('en-KE')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty">No uploads found</div>
        )}
      </div>

      {/* -- PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

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