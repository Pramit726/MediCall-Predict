import { useState } from 'react';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Users, Clock, Briefcase, Loader2, AlertCircle, Table as TableIcon } from 'lucide-react';

const Workforce = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({
    avg_call_time: 8,
    work_hours_per_agent: 8,
    department: 'Emergency'
  });

  const fetchWorkforce = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await API.post('/forecast', { 
      type: 'workforce',
      avg_call_time: parseInt(params.avg_call_time),
      work_hours_per_agent: parseInt(params.work_hours_per_agent),
      department: params.department
    });
    
    // SUCCESS: Drill into the forecast array so .length > 0 becomes true
    setData(res.data.workforce || []); 
    // console.log(res.data.workforce);
  } catch (err) {
    setError('ML Engine Error: Check FastAPI connection.');
  } finally {
    setLoading(false);
  }
};

  // Matching colors from the image: Red, Blue, Green
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f59e0b'];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Workforce Requirement Analysis</h1>
        <p className="text-slate-500">Calculate staffing levels based on forecasted traffic and agent capacity.</p>
      </div>

      {/* Parameter Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Avg. Call Time (min)</label>
          <input 
            type="number" 
            value={params.avg_call_time}
            onChange={(e) => setParams({...params, avg_call_time: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Work Hours/Agent</label>
          <input 
            type="number" 
            value={params.work_hours_per_agent}
            onChange={(e) => setParams({...params, work_hours_per_agent: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
          <select 
            value={params.department}
            onChange={(e) => setParams({...params, department: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Emergency">Emergency</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General">General</option>
          </select>
        </div>
        <button 
          onClick={fetchWorkforce}
          disabled={loading}
          className="bg-slate-900 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
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

      {data.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. Estimated Workforce Table (Matching Image) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <TableIcon size={18} className="text-slate-400" />
              <h3 className="font-bold text-slate-800">Estimated Workforce Requirements</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Month</th>
                  <th className="px-6 py-3 font-semibold">Forecasted Calls</th>
                  <th className="px-6 py-3 font-semibold">Agents Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-400">{index}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{row.month}</td>
                    <td className="px-6 py-4 text-slate-600">{row.forecasted_calls?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{row.agents_needed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Bar Chart Section (Matching Image) */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">
            Required Staffing Levels per Month
          </h3>

          {/* IMPORTANT: fixed height */}
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="agents_needed" name="Agents Needed">
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="bg-white p-20 rounded-xl border border-dashed border-slate-300 flex flex-col items-center text-slate-400">
          <Users size={48} className="mb-4 opacity-20" />
          <p>Click "Calculate Staffing" to see the required agent levels for each month.</p>
        </div>
      )}
    </div>
  );
};

export default Workforce;