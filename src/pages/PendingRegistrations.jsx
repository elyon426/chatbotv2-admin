// pages/PendingRegistrations.jsx
import { useState, useEffect } from 'react'
import { fetchPendingRegistrations, verifyRegistration } from '../api/index.js'

const ITEMS_PER_PAGE = 10

export default function PendingRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    setLoading(true)
    try {
      const res = await fetchPendingRegistrations()
      if (res.success) setRegistrations(res.data)
    } catch (error) {
      console.error('❌ Failed to load registrations:', error)
    } finally {
      setLoading(false)
    }
  }

  // -- Filter
  const filtered = registrations.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone_no?.includes(search) ||
    r.reg_no?.toLowerCase().includes(search.toLowerCase())
  )

  // -- Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // -- Select all / deselect all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginated.map(r => r.id))
    } else {
      setSelectedIds([])
    }
  }

  // -- Select individual
  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(pid => pid !== id))
    }
  }

  // -- Bulk verify
  const handleBulkVerify = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Verify ${selectedIds.length} registration(s)?`)) return
    
    setProcessing(true)
    try {
      const promises = selectedIds.map(id => verifyRegistration(id, 'verified'))
      const results = await Promise.all(promises)
      const allSuccess = results.every(r => r.success)
      
      if (allSuccess) {
        alert(`✅ ${selectedIds.length} registrations verified successfully!`)
        setSelectedIds([])
        await loadRegistrations()
      } else {
        alert('⚠️ Some verifications failed. Check console for details.')
      }
    } catch (error) {
      console.error('❌ Bulk verification failed:', error)
      alert('❌ Failed to verify registrations. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // -- Bulk reject
  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Reject ${selectedIds.length} registration(s)? This cannot be undone.`)) return
    
    setProcessing(true)
    try {
      const promises = selectedIds.map(id => verifyRegistration(id, 'rejected'))
      const results = await Promise.all(promises)
      const allSuccess = results.every(r => r.success)
      
      if (allSuccess) {
        alert(`✅ ${selectedIds.length} registrations rejected!`)
        setSelectedIds([])
        await loadRegistrations()
      } else {
        alert('⚠️ Some rejections failed. Check console for details.')
      }
    } catch (error) {
      console.error('❌ Bulk rejection failed:', error)
      alert('❌ Failed to reject registrations. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // -- Single verify
  const handleSingleVerify = async (id) => {
    if (!confirm('Verify this registration?')) return
    try {
      const res = await verifyRegistration(id, 'verified')
      if (res.success) {
        alert('✅ Registration verified!')
        await loadRegistrations()
      }
    } catch (error) {
      console.error('❌ Verification failed:', error)
      alert('❌ Failed to verify. Please try again.')
    }
  }

  // -- Single reject
  const handleSingleReject = async (id) => {
    if (!confirm('Reject this registration? This cannot be undone.')) return
    try {
      const res = await verifyRegistration(id, 'rejected')
      if (res.success) {
        alert('❌ Registration rejected!')
        await loadRegistrations()
      }
    } catch (error) {
      console.error('❌ Rejection failed:', error)
      alert('❌ Failed to reject. Please try again.')
    }
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  if (loading) return <div className="loading">Loading pending registrations...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pending Registrations</h1>
        <span className="badge">{registrations.length} pending</span>
        <span className="badge" style={{ background: '#e8f8f5', color: '#1a7a5a' }}>
          {registrations.filter(r => r.status === 'verified').length} verified
        </span>
        <span className="badge" style={{ background: '#fdedec', color: '#c0392b' }}>
          {registrations.filter(r => r.status === 'rejected').length} rejected
        </span>
      </div>

      {/* -- Search and Bulk Actions */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name, phone or reg no..."
          value={search}
          onChange={handleSearch}
        />
        
        {selectedIds.length > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">{selectedIds.length} selected</span>
            <button 
              className="btn btn-success"
              onClick={handleBulkVerify}
              disabled={processing}
            >
              {processing ? 'Processing...' : '✅ Verify All'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleBulkReject}
              disabled={processing}
            >
              {processing ? 'Processing...' : '❌ Reject All'}
            </button>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.length === paginated.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Reg No</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <tr key={r.id}>
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(r.id)}
                    onChange={(e) => handleSelectOne(r.id, e.target.checked)}
                    disabled={r.status === 'verified' || r.status === 'rejected'}
                  />
                </td>
                <td>{startIndex + i + 1}</td>
                <td><strong>{r.name}</strong></td>
                <td>{r.phone_no}</td>
                <td>{r.reg_no}</td>
                <td>
                  <span className={`status-badge ${r.status === 'verified' ? 'active' : r.status === 'rejected' ? 'expired' : 'pending'}`}>
                    {r.status || 'pending'}
                  </span>
                </td>
                <td>{new Date(r.created_at).toLocaleDateString('en-KE')}</td>
                <td>
                  {r.status === 'verified' ? (
                    <span className="muted">✅ Verified</span>
                  ) : r.status === 'rejected' ? (
                    <span className="muted">❌ Rejected</span>
                  ) : (
                    <>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleSingleVerify(r.id)}
                        disabled={processing}
                      >
                        Verify
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleSingleReject(r.id)}
                        disabled={processing}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty">No pending registrations found</div>
        )}
      </div>

      {/* -- Pagination */}
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