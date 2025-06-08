import React, { useEffect, useState } from 'react';
import { User } from '../../../../shared/types/user.types';
import { Link } from 'react-router-dom';

const fetchUsers = async (params: string) => {
  const res = await fetch(`/api/auth/users${params}`);
  return res.json();
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = `?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${search ? `&search=${search}` : ''}`;
    fetchUsers(params).then(data => {
      setUsers(data.data || []);
      setTotal(data.meta?.total || 0);
      setLoading(false);
    });
  }, [page, limit, search, sortBy, sortOrder]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <Link to="create" className="bg-blue-600 text-white px-4 py-2 rounded">Create User</Link>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2 cursor-pointer" onClick={() => setSortBy('firstName')}>Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Last Login</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center p-4">Loading...</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan={6} className="text-center p-4">No users found.</td></tr>
          ) : users.map(user => (
            <tr key={user._id}>
              <td className="p-2 flex items-center gap-2">
                <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                {user.firstName} {user.lastName}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.isActive ? 'Active' : 'Inactive'}</td>
              <td className="p-2">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</td>
              <td className="p-2 flex gap-2">
                <Link to={`${user._id}`} className="text-blue-600">View</Link>
                <Link to={`${user._id}/edit`} className="text-yellow-600">Edit</Link>
                {/* Add delete logic as needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded">Prev</button>
        <span>Page {page}</span>
        <button disabled={users.length < limit} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  );
};

export default UsersList;