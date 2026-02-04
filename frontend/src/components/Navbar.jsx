import { Link, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, LogOut, Activity } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Retrieve user data to check for Admin role
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white h-screen w-64 fixed left-0 top-0 flex flex-col p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-10 px-2">
        <Activity className="text-blue-400" size={32} />
        <span className="text-xl font-bold tracking-tight">MediCall-Predict</span>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <Home size={20} /> Home
        </Link>
        
        <Link to="/forecast" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <BarChart2 size={20} /> Forecast
        </Link>

        <Link to="/workforce" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors">
          <Users size={20} /> Workforce
        </Link>

        {/* Admin only appears if the user role is 'Admin' */}
        {isAdmin && (
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-900/30 text-blue-400 rounded-lg transition-colors border border-blue-800/50 mt-4">
            <Settings size={20} /> Admin Logs
          </Link>
        )}
      </div>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors mt-auto"
      >
        <LogOut size={20} /> Logout
      </button>
    </nav>
  );
};

export default Navbar;