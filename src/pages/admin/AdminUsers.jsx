import { useState, useEffect } from 'react'
import { adminApi } from '@/api/adminApi'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ROLE_COLORS = { BUYER: 'bg-blue/10 text-blue', SELLER: 'bg-green/10 text-green', ADMIN: 'bg-purple/10 text-purple' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)

  const fetchUsers = (p = 0) => {
    setLoading(true)
    adminApi.getUsers(p)
      .then(r => setUsers(r.data.data || [] || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers(page) }, [page])

  const handleDisable = async (uuid) => {
    await adminApi.disableUser(uuid)
    fetchUsers(page)
  }

  const handleEnable = async (uuid) => {
    await adminApi.enableUser(uuid)
    fetchUsers(page)
  }

  const handleGrantSeller = async (uuid) => {
    await adminApi.grantSeller(uuid)
    fetchUsers(page)
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <Input placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64" />
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="h-6 w-6" /></div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Role</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Joined</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback className="text-xs">{u.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3"><Badge className={ROLE_COLORS[u.role] || 'bg-muted text-muted-foreground'}>{u.role}</Badge></td>
                  <td className="p-3">
                    <Badge className={u.isActive ? 'bg-green/10 text-green' : 'bg-red-100 text-red-600'}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {u.isActive
                        ? <Button size="sm" variant="destructive" onClick={() => handleDisable(u.uuid || u.id)}>Disable</Button>
                        : <Button size="sm" variant="outline" onClick={() => handleEnable(u.uuid || u.id)}>Enable</Button>}
                      {u.role === 'BUYER' && (
                        <Button size="sm" variant="outline" onClick={() => handleGrantSeller(u.uuid || u.id)}>Grant Seller</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
