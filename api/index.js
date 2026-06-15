const BASE_URL = import.meta.env.VITE_API_URL

export const fetchOverview = () => 
  fetch(`${BASE_URL}/api/v1/admin/overview`).then(r => r.json())

export const fetchClients = () => 
  fetch(`${BASE_URL}/api/v1/admin/clients`).then(r => r.json())

export const fetchRenewals = () => 
  fetch(`${BASE_URL}/api/v1/admin/renewals`).then(r => r.json())

export const fetchPayments = () => 
  fetch(`${BASE_URL}/api/v1/admin/payments`).then(r => r.json())

export const fetchPolicies = () => 
  fetch(`${BASE_URL}/api/v1/admin/policies`).then(r => r.json())

export const fetchLegacy = () => 
  fetch(`${BASE_URL}/api/v1/admin/legacy`).then(r => r.json())

export const fetchPendingRenewals = () => 
  fetch(`${BASE_URL}/api/v1/admin/pending-renewals`).then(r => r.json())