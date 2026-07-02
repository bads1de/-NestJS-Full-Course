import { useEffect, useState } from 'react'
import { authClient } from '../lib/auth-client'

type User = {
  id: string
  name: string
  email: string
  role: string
  emailVerified: boolean
  createdAt: string
}

type EditingUser = {
  id: string
  name: string
  email: string
  role: string
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

async function updateUser(id: string, data: Partial<EditingUser>): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update user')
  return res.json()
}

async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete user')
}

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<EditingUser | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setError('')
      setLoading(true)
      const data = await fetchUsers()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing) return
    try {
      await updateUser(editing.id, {
        name: editing.name,
        email: editing.email,
        role: editing.role,
      })
      setEditing(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update user')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete user')
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-nav">
          <button type="button" onClick={onBack}>Back to App</button>
          <button type="button" onClick={async () => { await authClient.signOut(); onBack() }}>Sign Out</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.emailVerified ? 'Yes' : 'No'}</td>
                <td className="actions">
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => setEditing({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                    })}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Edit User</h2>
            <div className="field">
              <label htmlFor="edit-name">Name</label>
              <input
                id="edit-name"
                type="text"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                type="email"
                value={editing.email}
                onChange={e => setEditing({ ...editing, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-role">Role</label>
              <select
                id="edit-role"
                value={editing.role}
                onChange={e => setEditing({ ...editing, role: e.target.value })}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setEditing(null)}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
