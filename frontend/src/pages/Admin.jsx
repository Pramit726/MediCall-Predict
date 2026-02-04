import { useEffect, useState } from 'react';
import API from '../services/api';
import { ShieldCheck, Clock, User, Info, AlertTriangle, UserPlus } from 'lucide-react';

const Admin = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- NEW STATES FOR USER CREATION ---
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Staff' });
  const [msg, setMsg] = useState('');

  // --- HANDLER FOR USER CREATION ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await API.post('/auth/create-user', newUser);
      setMsg(`✅ ${res.data.message}`);
      setNewUser({ username: '', password: '', role: 'Staff' }); // Reset form
    } catch (err) {
      setMsg('❌ Error: ' + (err.response?.data?.message || 'Failed to create user'));
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await API.get('/admin/logs');
        setLogs(res.data);
      } catch (err) {
        setError('Failed to fetch audit logs. You may not have administrative permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Administrative Control Panel</h1>
          <p className="text-slate-500">Manage user accounts and monitor system security audits.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 border border-blue-100">
          <ShieldCheck size={20} />
          <span className="font-semibold">Security Verified</span>
        </div>
      </div>

      {/* --- NEW SECTION: USER CREATION FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-slate-800">Create New Staff Account</h2>
        </div>
        
        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${msg.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
            <input 
              type="text" 
              value={newUser.username}
              onChange={(e) => setNewUser({...newUser, username: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="e.g. dr_smith"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role</label>
            <select 
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-slate-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
            Create Account
          </button>
        </form>
      </div>

      {/* Audit Logs Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">System Activity Logs</h2>
        </div>
        {loading ? (
          <div className="p-20 text-center text-slate-400">Loading audit history...</div>
        ) : error ? (
          <div className="p-20 text-center text-red-500 flex flex-col items-center">
            <AlertTriangle size={48} className="mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" /> {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500">
                        {log.userId?.username?.substring(0,2).toUpperCase() || '??'}
                      </div>
                      {log.userId?.username || "Unknown System User"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded text-[11px] font-bold text-slate-600">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;