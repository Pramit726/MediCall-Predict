import { useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, ClipboardList, AlertCircle, Loader2 } from 'lucide-react';

const Workforce = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({ weeks: 4, department: 'General' });

  const fetchWorkforce = async () => {
    setLoading(true);
    setError('');
    try {
      // Calls the specific Node.js route that proxies to /workforce_requirement
      const res = await API.post('/forecast', { 
        weeks: params.weeks, 
        department: params.department 
      });
      
      // Assumes FastAPI returns: { workforce: [{ week: 'W1', staff_needed: 12 }, ...] }
      setData(res.data.workforce || []); 
    } catch (err) {
      setError('Could not calculate workforce requirements. Ensure the ML Service is running.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Workforce Planning</h1>
        <p className="text-slate-500">AI-driven staffing recommendations based on predicted call traffic.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Planning Horizon (Weeks)</label>
          <input 
            type="number" 
            value={params.weeks}
            onChange={(e) => setParams({...params, weeks: e.target.value})}
            className="border rounded-lg px-3 py-2 w-32 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select 
            value={params.department}
            onChange={(e) => setParams({...params, department: e.target.value})}
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        <button 
          onClick={fetchWorkforce}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Users size={20} />}
          Calculate Staffing
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Requirement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Staffing Distribution</h3>
          <div className="h-64 w-full">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="staff_needed" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">No data calculated</div>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold text-slate-800">Shift Allocation Table</h3>
          </div>
          <table className="w-full text-left">
            <thead className="border-b border-slate-100">
              <tr className="text-slate-500 text-sm">
                <th className="pb-3 font-medium">Period</th>
                <th className="pb-3 font-medium text-right">Recommended Agents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((row, idx) => (
                <tr key={idx} className="text-slate-700">
                  <td className="py-3 font-medium">{row.week}</td>
                  <td className="py-3 text-right">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                      {row.staff_needed}
                    </span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="2" className="py-10 text-center text-slate-400">Run calculation to see shift details</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workforce;