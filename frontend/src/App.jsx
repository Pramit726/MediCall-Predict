import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Workforce from './pages/Workforce';
import Admin from './pages/Admin';

function App() {
  // We check for the token to decide whether to show the Login page or the Dashboard
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Public Route: Anyone can see the Login page */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes: Only accessible if logged in */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex bg-slate-50 min-h-screen">
              {/* This Navbar is the one we created with Home, Forecast, and Workforce links */}
              <Navbar />
              
              {/* Main Content Area: Offset by the 64px width of the Sidebar Navbar */}
              <main className="ml-64 flex-1 p-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/forecast" element={<Forecast />} />
                  <Route path="/workforce" element={<Workforce />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;