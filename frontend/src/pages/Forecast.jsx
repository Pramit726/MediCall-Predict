import { useState } from 'react';
import API from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, RefreshCcw, AlertCircle } from 'lucide-react';

const Forecast = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [params, setParams] = useState({ days: 30, department: 'General' });

  const fetchForecast = async () => {
    setLoading(true);
    setError('');
    try {
      // Calling our Node.js Proxy (which then calls FastAPI)
      const res = await API.post('/forecast', params);
      
      // Ensure the data format matches what Recharts expects
      // Usually an array of objects: [{ name: 'Day 1', traffic: 120 }, ...]
      setData(res.data.forecast); 
    } catch (err) {
      setError('Failed to fetch forecasting data. Ensure the ML service is online.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Traffic Forecasting</h1>
        <p className="text-slate-500">Predict future call center volumes based on historical trends.</p>
      </div>

      {/* Input Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Forecast Period (Days)</label>
          <input 
            type="number" 
            value={params.days}
            onChange={(e) => setParams({...params, days: e.target.value})}
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
          onClick={fetchForecast}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="animate-spin" size={20} /> : <Calendar size={20} />}
          Generate Forecast
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle size={24} />
          {error}
        </div>
      )}

      {/* Visualization Area */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[450px] flex items-center justify-center">
        {data.length > 0 ? (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Legend iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="predicted_traffic" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 6 }} 
                  name="Predicted Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <BarChart2 size={48} className="mb-2 opacity-20" />
            <p>Click "Generate Forecast" to visualize traffic predictions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;