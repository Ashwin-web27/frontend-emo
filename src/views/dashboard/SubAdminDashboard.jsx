import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { FiUserPlus, FiUsers, FiUserCheck, FiUser, FiLogOut, FiMenu, FiHome } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function SubAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage
    const token = localStorage.getItem('subadmin-token');
    const storedUser = localStorage.getItem('subadmin-data');

    if (!token) {
      navigate('/subadmin/login');
      return;
    }

    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Extract basic user info from token if no user data stored
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          name: tokenPayload.name || 'Sub Admin',
          email: tokenPayload.email,
          profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(tokenPayload.name || 'SA')}&background=indigo`
        });
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      localStorage.removeItem('subadmin-token');
      localStorage.removeItem('subadmin-data');
      navigate('/subadmin/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('subadmin-token');
    localStorage.removeItem('subadmin-data');
    toast.success('Logged out successfully');
    navigate('/subadmin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return null;

  // Determine active sidebar item
  const isActive = (path) => location.pathname.toLowerCase().includes(path);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          {sidebarOpen ? (
            <h1 className="text-xl font-semibold text-indigo-600">Sub Admin Portal</h1>
          ) : (
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white">
              SA
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiMenu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 mt-6">
          <Link
            to="/subadmin/dashboard"
            className={`flex items-center w-full px-4 py-3 ${isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiHome className="mr-3" size={18} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/subadmin/history"
            className={`flex items-center w-full px-4 py-3 ${isActive('/manage-users') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUsers className="mr-3" size={18} />
            {sidebarOpen && <span>Manage Users</span>}
          </Link>
          <Link
            to="/subadmin/add-employee"
            className={`flex items-center w-full px-4 py-3 ${isActive('/manage-users') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUsers className="mr-3" size={18} />
            {sidebarOpen && <span>Add Employee</span>}
          </Link>

          <Link
            to="/subadmin/manage-employees"
            className={`flex items-center w-full px-4 py-3 ${isActive('/manage-employees') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FiUser className="mr-3" size={18} />
            {sidebarOpen && <span>Manage Employees</span>}
          </Link>
        </nav>

        {/* Profile section at bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 mr-3">
              <img 
                src={user.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
            >
              <FiLogOut className="mr-2" size={16} />
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-medium text-gray-800">
              {isActive('/dashboard') && 'Dashboard'}
              {isActive('/add-user') && 'Add User'}
              {isActive('/manage-users') && 'Manage Users'}
              {isActive('/manage-employees') && 'Manage Employees'}
            </h2>
            
            {/* Mobile profile button */}
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="md:hidden flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-100">
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet context={{ user }} />
        </main>
      </div>

      {/* Mobile Profile Menu */}
      {showProfileMenu && (
        <>
          <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setShowProfileMenu(false)} />
          <div className="fixed right-4 top-16 z-30 w-48 bg-white rounded-md shadow-lg py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-500 text-xs">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}