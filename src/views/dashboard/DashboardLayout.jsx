import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiUserPlus, FiClock, FiLogOut, FiMenu } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:5000';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef();

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auth check
  useEffect(() => {
    const verifyTokenAndGetUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error('Invalid session');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        navigate('/login');
        window.location.reload();
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndGetUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');

      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      if (token) {
        await axios.post(`${API_URL}/api/v1/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      toast.success('Logged out successfully');
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-semibold text-indigo-600">Employee Portal</h1>
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              EP
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <nav className="mt-6">
          <button
            onClick={() => navigate('/dashboard/add-user')}
            className={`flex items-center w-full px-4 py-3 ${location.pathname.includes('add-user') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUserPlus className="mr-3" size={18} />
            {sidebarOpen && <span>Add User</span>}
          </button>

          <button
            onClick={() => navigate('/dashboard/history')}
            className={`flex items-center w-full px-4 py-3 ${location.pathname.includes('history') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiClock className="mr-3" size={18} />
            {sidebarOpen && <span>History</span>}
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              {location.pathname.includes('add-user') ? 'Add New User' : 'Activity History'}
            </h2>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user.fullName || user.name}
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100">
                  <img 
                    src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name)}&background=random`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user.fullName || user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" size={20} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
