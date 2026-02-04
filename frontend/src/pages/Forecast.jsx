import { useState } from 'react';
import API from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, RefreshCcw, AlertCircle, TrendingUp, Table as TableIcon } from 'lucide-react';

const Forecast = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({ n_months: 6, department: 'Emergency' });

  const fetchForecast = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/forecast', {
        type: 'traffic',
        n_months: parseInt(params.n_months),
        department: params.department
      });
      
      // Assumes API returns: [{ month: 'Jan 2024', forecasted_calls: 16007, change: 3.03 }, ...]
      setData(res.data.forecast || []); 
    } catch (err) {
      setError('Failed to fetch forecasting data. Ensure the ML service is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Traffic Forecasting</h1>
        <p className="text-slate-500">Predict future call center volumes based on historical trends.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Forecast Horizon (Months)</label>
          <input 
            type="number" 
            value={params.n_months}
            onChange={(e) => setParams({...params, n_months: e.target.value})}
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
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
          onClick={fetchForecast}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50 h-[42px]"
        >
          {loading ? <RefreshCcw className="animate-spin" size={20} /> : <Calendar size={20} />}
          Generate Forecast
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="space-y-8">
          {/* 1. Data Table Section (Matching Image Design) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <TableIcon size={18} className="text-slate-400" />
              <h3 className="font-bold text-slate-800">Forecasted Call Volumes</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">#</th>
                  <th className="px-6 py-3 font-semibold">Month</th>
                  <th className="px-6 py-3 font-semibold">Forecasted Calls</th>
                  <th className="px-6 py-3 font-semibold">Change (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-400">{index}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{row.month}</td>
                    <td className="px-6 py-4 text-slate-900">{row.forecasted_calls.toLocaleString()}</td>
                    <td className={`px-6 py-4 font-bold ${row.change_from_previous_month >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.change_from_previous_month > 0 ? `+${row.change_from_previous_month}` : row.change_from_previous_month}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 2. Chart Section (Matching Image Design) */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">
              Forecasted Call Volume (Monthly)
            </h3>
          </div>

          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="forecasted_calls"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
      )}

      {data.length === 0 && !loading && (
        <div className="bg-white p-20 rounded-xl border border-dashed border-slate-300 flex flex-col items-center text-slate-400">
          <TrendingUp size={48} className="mb-4 opacity-20" />
          <p>Set parameters and click generate to view the monthly forecast.</p>
        </div>
      )}
    </div>
  );
};

export default Forecast;