// pages/SqlEditor.jsx 
import { useState } from 'react'

export default function SqlEditor() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // -- OTP lookup
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState(null)

  const BASE_URL = import.meta.env.VITE_API_URL

  const runQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      if (data.success) setResults(data.data)
      else setError(data.error)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const lookupOTP = async () => {
    if (!phone.trim()) return
    setOtpLoading(true)
    setOtpError(null)
    setOtp(null)
    try {
      const res = await fetch(`${BASE_URL}/api/v1/admin/otp/${phone.trim()}`)
      const data = await res.json()
      if (data.success) setOtp(data.otp)
      else setOtpError(data.message)
    } catch (err) {
      setOtpError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const columns = results?.length > 0 ? Object.keys(results[0]) : []

  return (
    <div className="page">

      {/* -- OTP Lookup */}
      <div className="chart-card" style={{ marginBottom: '24px' }}>
        <h2 className="chart-title">OTP Lookup</h2>
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>
          Enter customer phone number to retrieve their current OTP from Redis
        </p>
        <div className="filters-row">
          <input
            className="search-input"
            style={{ marginBottom: 0 }}
            placeholder="e.g. +254755398201"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={lookupOTP}
            disabled={otpLoading}
          >
            {otpLoading ? 'Looking up...' : 'Lookup OTP'}
          </button>
        </div>
        {otp && (
          <div className="otp-result">
            OTP for <strong>{phone}</strong>: 
            <span className="otp-code">{otp}</span>
          </div>
        )}
        {otpError && (
          <div className="error-msg">{otpError}</div>
        )}
      </div>

      {/* -- SQL Editor */}
      <div className="chart-card">
        <h2 className="chart-title">SQL Editor</h2>
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '12px' }}>
          Only SELECT queries allowed
        </p>
        <textarea
          className="sql-textarea"
          placeholder="SELECT * FROM clients LIMIT 10"
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={5}
        />
        <button
          className="btn-primary"
          onClick={runQuery}
          disabled={loading}
          style={{ marginTop: '12px' }}
        >
          {loading ? 'Running...' : '▶ Run Query'}
        </button>

        {error && <div className="error-msg" style={{ marginTop: '12px' }}>{error}</div>}

        {results && (
          <div className="table-wrapper" style={{ marginTop: '16px' }}>
            <div style={{ padding: '8px 16px', background: '#f7fafc', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#718096' }}>
              {results.length} row{results.length !== 1 ? 's' : ''} returned
            </div>
            {results.length === 0 ? (
              <div className="empty">Query returned no results</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    {columns.map(col => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i}>
                      {columns.map(col => (
                        <td key={col}>
                          {row[col] === null ? <span style={{ color: '#a0aec0' }}>null</span> : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}