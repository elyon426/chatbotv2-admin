// pages/Client.jsx
import { useEffect, useState } from 'react'
import { fetchClients } from '../api/index'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClients()
      .then(data => {
        setClients(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="page"><h1>Clients</h1><p>Loading...</p></div>
  if (error) return <div className="page"><h1>Clients</h1><p>Error: {error}</p></div>

  return (
    <div className="page">
      <h1>Clients</h1>
      {clients.length === 0 ? (
        <p>No clients found</p>
      ) : (
        <ul>
          {clients.map(client => (
            <li key={client.id}>{client.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
