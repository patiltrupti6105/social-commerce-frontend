import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { formatDate } from '../../lib/utils';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      // Mock data for demo
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'BUYER', status: 'active', createdAt: new Date().toISOString(), avatar: null },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'SELLER', status: 'active', createdAt: new Date(Date.now() - 86400000).toISOString(), avatar: null },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'BUYER', status: 'suspended', createdAt: new Date(Date.now() - 172800000).toISOString(), avatar: null },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'ADMIN', status: 'active', createdAt: new Date(Date.now() - 259200000).toISOString(), avatar: null },
        { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'SELLER', status: 'pending', createdAt: new Date(Date.now() - 345600000).toISOString(), avatar: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    }
    setSelectedUser(null);
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await api.patch(`/admin/users/${userId}`, { status: newStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    }
    setSelectedUser(null);
  };

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      SELLER: 'bg-purple-100 text-purple-800',
      BUYER: 'bg-blue-100 text-blue-800',
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${colors[role]}`}>{role}</span>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-amber-100 text-amber-800',
    };
    return <span className={`px-2 py-1 text-xs rounded-full capitalize ${colors[status]}`}>{status}</span>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Roles</option>
          <option value="BUYER">Buyers</option>
          <option value="SELLER">Sellers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-muted-foreground">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* User Action Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-foreground mb-4">Manage User</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Change Role</p>
                  <div className="flex flex-wrap gap-2">
                    {['BUYER', 'SELLER', 'ADMIN'].map((role) => (
                      <button
                        key={role}
                        onClick={() => updateUserRole(selectedUser, role)}
                        className="px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted transition-colors"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Change Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['active', 'suspended', 'pending'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateUserStatus(selectedUser, status)}
                        className="px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted transition-colors capitalize"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm border border-input rounded-lg hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
