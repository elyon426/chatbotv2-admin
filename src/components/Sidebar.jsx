import { NavLink } from 'react-router-dom'
import {
  MdDashboard,
  MdPeople,
  MdPolicy,
  MdAutorenew,
  MdPayment,
  MdHistory,
  MdCode,
  MdUpload
} from 'react-icons/md'

const links = [
  { to: '/dashboard', icon: <MdDashboard size={20} />, label: 'Overview' },
  { to: '/dashboard/clients', icon: <MdPeople size={20} />, label: 'Clients' },
  { to: '/dashboard/uploads', icon: <MdUpload size={20} />, label: 'Uploads' },  
  { to: '/dashboard/policies', icon: <MdPolicy size={20} />, label: 'Policies' },
  { to: '/dashboard/renewals', icon: <MdAutorenew size={20} />, label: 'Renewals' },
  { to: '/dashboard/payments', icon: <MdPayment size={20} />, label: 'Payments' },
  { to: '/dashboard/legacy', icon: <MdHistory size={20} />, label: 'Legacy Clients' },
  { to: '/dashboard/sql', icon: <MdCode size={20} />, label: 'SQL Editor' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}