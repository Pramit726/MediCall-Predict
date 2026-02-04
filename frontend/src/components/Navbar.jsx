import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Users, Shield, LogOut, Activity } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-semibold">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 mb-10 px-2">
        <Activity className="text-blue-600" size={28} />
        <span className="text-xl font-bold text-slate-900 tracking-tight">MediCall-Predict</span>
      </div>

      {/* Main Links */}
      <div className="flex-1 space-y-2">
        <NavLink to="/" icon={Home} label="Home" />
        <NavLink to="/forecast" icon={TrendingUp} label="Forecast" />
        <NavLink to="/workforce" icon={Users} label="Workforce" />
        {user?.role === 'Admin' && (
          <NavLink to="/admin" icon={Shield} label="Admin Logs" />
        )}
      </div>

      {/* User & Logout Section */}
      <div className="pt-6 border-t border-slate-100">
        <div className="px-4 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase">Logged in as</p>
          <p className="text-sm font-bold text-slate-700">{user?.username}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;