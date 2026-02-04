import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Users, ShieldCheck, Cpu, 
  TrendingUp, ArrowRight, Zap, Server, 
  Clock, Database, BrainCircuit 
} from 'lucide-react';
import API from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({ totalLogs: 0, lastActivity: '' });
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await API.get('/admin/logs');
        setStats({
          totalLogs: res.data.length,
          lastActivity: res.data[0]?.timestamp || null
        });
      } catch (err) {
        console.error("Home stats error:", err);
      }
    };
    fetchQuickStats();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto pb-20 px-4 md:px-10">
      {/* 1. ENTERPRISE HEADER SECTION */}
      <header className="mb-12 pt-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold tracking-widest text-xs uppercase">
            <Zap size={14} fill="currentColor" className="animate-pulse" />
            System Live Pulse
          </div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            Healthcare <span className="text-blue-600">Operations Console</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">
            Unified predictive intelligence for clinical workforce and patient traffic optimization.
          </p>
        </div>
        
        <div className="flex items-center gap-5 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="h-12 w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
            {user?.username?.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated As</p>
            <p className="text-sm font-bold text-slate-800">{user?.username} ({user?.role})</p>
          </div>
        </div>
      </header>

      {/* 2. KPI PERFORMANCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <KpiCard 
          icon={<TrendingUp size={22} />} 
          label="ML Engine (FastAPI)" 
          value="Operational" 
          status="Latency: 34ms"
          theme="blue"
        />
        <KpiCard 
          icon={<Server size={22} />} 
          label="Gateway Status" 
          value="Ready" 
          status="Node.js Proxy Active"
          theme="indigo"
        />
        <KpiCard 
          icon={<ShieldCheck size={22} />} 
          label="Audit Repository" 
          value={stats.totalLogs} 
          status={stats.lastActivity ? `Last: ${new Date(stats.lastActivity).toLocaleTimeString()}` : 'No Records'}
          theme="emerald"
        />
        <KpiCard 
          icon={<Database size={22} />} 
          label="Cluster Sync" 
          value="Stable" 
          status="MongoDB Atlas Online"
          theme="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* 3. ARCHITECTURE OVERVIEW SECTION */}
        <div className="xl:col-span-8">
          <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-100">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <BrainCircuit className="text-blue-400" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Decoupled Prediction Logic</h2>
                  {/* <p className="text-blue-400 font-semibold text-sm">VIT M.Tech CSE Capstone Framework</p> */}
                </div>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-3xl font-medium">
                This system leverages a <span className="text-white font-bold">microservices approach</span> to separate intensive ARIMA-based 
                forecasting from secure data management. By decoupling the FastAPI Engine from the MERN Middleware, we ensure 
                scalability and immutable logging for clinical compliance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureMetric title="Forecasting" desc="ARIMA AI Models" />
                <FeatureMetric title="Auditing" desc="Immutable MongoDB Trails" />
                <FeatureMetric title="Security" desc="JWT & RSA Encryption" />
              </div>
            </div>
            
            {/* Background Accent Element */}
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={320} strokeWidth={1} />
            </div>
          </section>
        </div>

        {/* 4. CLINICAL ACTION HUB */}
        <div className="xl:col-span-4 space-y-6 flex flex-col justify-center">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-1">Navigation Modules</h3>
          
          <ActionTile 
            title="Traffic Analysis" 
            desc="Predict patient inflow trends"
            icon={<TrendingUp size={22} />} 
            onClick={() => navigate('/forecast')}
            primary
          />
          <ActionTile 
            title="Staffing Logic" 
            desc="Calculate agent requirements"
            icon={<Users size={22} />} 
            onClick={() => navigate('/workforce')}
          />
          {user?.role === 'Admin' && (
            <ActionTile 
              title="Security Center" 
              desc="Review system audit trails"
              icon={<ShieldCheck size={22} />} 
              onClick={() => navigate('/admin')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// --- STYLED HELPER COMPONENTS ---

const KpiCard = ({ icon, label, value, status, theme }) => {
  const themes = {
    blue: 'bg-blue-600 text-white shadow-blue-100',
    indigo: 'bg-indigo-600 text-white shadow-indigo-100',
    emerald: 'bg-emerald-600 text-white shadow-emerald-100',
    purple: 'bg-purple-600 text-white shadow-purple-100',
  };

  return (
    <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className={`w-12 h-12 ${themes[theme]} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900">{value}</h4>
      <p className="text-[11px] text-slate-500 font-bold mt-4 flex items-center gap-1.5 uppercase">
        <Clock size={12} className="text-slate-300" /> {status}
      </p>
    </div>
  );
};

const FeatureMetric = ({ title, desc }) => (
  <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
    <h5 className="font-bold text-white text-sm mb-0.5">{title}</h5>
    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">{desc}</p>
  </div>
);

const ActionTile = ({ title, desc, icon, onClick, primary }) => (
  <button 
    onClick={onClick}
    className={`w-full group p-6 rounded-[1.75rem] flex items-center justify-between transition-all duration-300 border ${
      primary 
      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' 
      : 'bg-white border-slate-200 text-slate-900 hover:border-blue-500 hover:shadow-md'
    }`}
  >
    <div className="flex items-center gap-5 text-left">
      <div className={`p-3 rounded-xl transition-colors ${primary ? 'bg-white/10' : 'bg-slate-50 text-slate-400 group-hover:text-blue-600'}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-lg leading-none">{title}</h4>
        <p className={`text-xs mt-1 font-medium ${primary ? 'text-blue-100' : 'text-slate-500'}`}>{desc}</p>
      </div>
    </div>
    <ArrowRight size={20} className={`opacity-0 group-hover:opacity-100 transition-all ${primary ? '' : 'text-blue-600'}`} />
  </button>
);

export default Home;