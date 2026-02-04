import { useEffect, useState } from 'react';
import { Activity, Users, Shield, TrendingUp } from 'lucide-react';
import API from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({ totalLogs: 0, lastActivity: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await API.get('/admin/logs');
        setStats({
          totalLogs: res.data.length,
          lastActivity: res.data[0]?.timestamp || 'No recent activity'
        });
      } catch (err) {
        console.error("Home stats error:", err);
      }
    };
    fetchQuickStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.username}!</h1>
        <p className="text-slate-500">System overview for MediCall-Predict Workforce Analytics.</p>
      </header>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<TrendingUp className="text-blue-600" />} 
          label="System Status" 
          value="Online" 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Users className="text-indigo-600" />} 
          label="Current User Role" 
          value={user?.role || 'Staff'} 
          color="bg-indigo-50"
        />
        <StatCard 
          icon={<Shield className="text-emerald-600" />} 
          label="Audit Records" 
          value={stats.totalLogs} 
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<Activity className="text-purple-600" />} 
          label="ML Engine" 
          value="Ready" 
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Description Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-4">About the System</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            MediCall-Predict uses a <strong>decoupled microservices architecture</strong> to bridge the gap between 
            Python-based Machine Learning and modern Full-Stack web interfaces.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-700">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              Real-time Traffic Forecasting via FastAPI
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              Automated Workforce Requirement Analysis
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <div className="h-2 w-2 bg-blue-500 rounded-full" />
              Secure Audit Logging with MongoDB
            </li>
          </ul>
        </div>

        {/* Action Quicklinks */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all text-left">
              View Forecasts
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all text-left">
              Calculate Staffing
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all font-semibold">
              System Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Cards
const StatCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-2xl border border-slate-200 shadow-sm bg-white`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

export default Home;