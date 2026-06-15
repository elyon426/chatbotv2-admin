export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🛡️</span>
        <span className="navbar-title">Vision Insurance Agency</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-date">
          {new Date().toLocaleDateString('en-KE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <div className="navbar-admin">
          <span className="admin-avatar">A</span>
          <span className="admin-name">Admin</span>
        </div>
      </div>
    </nav>
  )
}