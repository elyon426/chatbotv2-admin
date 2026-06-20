import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Overview from './pages/Overview'
import Clients from './pages/Clients'
import Policies from './pages/Policies'
import Renewals from './pages/Renewals'
import Payments from './pages/Payments'
import Legacy from './pages/Legacy';
import SQLEditor from './pages/SqlEditor'
import Uploads from './pages/Uploads'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/uploads" element={<Uploads />} />
            <Route path="/dashboard/policies" element={<Policies />} />
            <Route path="/dashboard/renewals" element={<Renewals />} />
            <Route path="/dashboard/payments" element={<Payments />} />
            <Route path="/dashboard/legacy" element={<Legacy />} />
            <Route path="/dashboard/sql" element={<SQLEditor />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
