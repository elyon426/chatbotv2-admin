// pages/Overview.jsx
import { useState, useEffect } from 'react'
import { MdPeople, MdPolicy, MdAutorenew, MdPayment } from 'react-icons/md'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchOverview, fetchPolicies, fetchPayments, fetchPendingRenewals } from '../api/index.js'

const COLORS = ['#1a7f37', '#c0392b', '#718096']

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [policies, setPolicies] = useState([])
  const [payments, setPayments] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchOverview(),
      fetchPolicies(),
      fetchPayments(),
      fetchPendingRenewals()
    ]).then(([overview, pol, pay, pend]) => {
      if (overview.success) setStats(overview.data)
      if (pol.success) setPolicies(pol.data)
      if (pay.success) setPayments(pay.data)
      if (pend.success) setPending(pend.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  // -- Pie chart data
  const policyStatusData = [
    { name: 'Active', value: policies.filter(p => p.policy_status === 'active').length },
    { name: 'Expired', value: policies.filter(p => p.policy_status === 'expired').length },
    { name: 'Cancelled', value: policies.filter(p => p.policy_status === 'cancelled').length },
  ]

  // -- Expiring in 7 days
  const today = new Date()
  const in7Days = new Date()
  in7Days.setDate(today.getDate() + 7)
  const expiringSoon = policies.filter(p => {
    const expiry = new Date(p.expiring_date)
    return expiry >= today && expiry <= in7Days && p.policy_status === 'active'
  })

  // -- Recent payments (last 5)
  const recentPayments = payments.slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Overview</h1>
      </div>

      {/* -- Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><MdPeople size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalClients || 0}</span>
            <span className="stat-label">Total Clients</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><MdPolicy size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.activePolicies || 0}</span>
            <span className="stat-label">Active Policies</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><MdAutorenew size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.overdueRenewals || 0}</span>
            <span className="stat-label">Overdue Renewals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><MdPayment size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.paymentsToday || 0}</span>
            <span className="stat-label">Payments Today</span>
          </div>
        </div>
      </div>

      {/* -- Charts row */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Policy Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={policyStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {policyStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Expiring Soon (7 days)</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {expiringSoon.length === 0 ? (
                  <tr><td colSpan={3}><div className="empty">None expiring soon</div></td></tr>
                ) : (
                  expiringSoon.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.reg_no}</td>
                      <td>{new Date(p.expiring_date).toLocaleDateString('en-KE')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* -- Bottom row */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Recent Payments</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reg No</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.length === 0 ? (
                  <tr><td colSpan={4}><div className="empty">No payments yet</div></td></tr>
                ) : (
                  recentPayments.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.reg_no}</td>
                      <td>KES {Number(p.amount).toLocaleString()}</td>
                      <td>{new Date(p.paid_at).toLocaleDateString('en-KE')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Pending Renewals</h2>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Phone</th>
                  <th>Reg No</th>
                  <th>Requested</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 ? (
                  <tr><td colSpan={3}><div className="empty">No pending renewals</div></td></tr>
                ) : (
                  pending.map((p, i) => (
                    <tr key={i}>
                      <td>{p.phone_no}</td>
                      <td>{p.reg_no}</td>
                      <td>{new Date(p.requested_at).toLocaleDateString('en-KE')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}




