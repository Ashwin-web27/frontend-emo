// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from './views/dashboard/DashboardLayout';
import AddUserPage from './views/user/AddUserPage';
import HistoryPage from './views/history/HistoryPage';
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './views/auth/AdminLogin';
import SubAdminDashboard from './views/dashboard/SubAdminDashboard';
import AdminDashboard from './views/dashboard/admin/DashboardLayout' 
import SubAdminLogin from './views/auth/SubAdminLogin';
import SubadminSignup from './views/auth/SubadminSignup';
import AddEmployee from './views/employee/AddEmployee';
import ManageEmployee from './views/employee/manageEmployee';
import SubadminPage from './views/subadmins/SubAdmin'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/subadmin/add-employee" element={<Signup/>} />
        <Route path="/subadmin/dashboard" element={<SubAdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/subadmin/login" element={<SubAdminLogin />} />
        <Route path="/admin/subadmins" element={<SubadminPage/>} />
        <Route path="/subadmin/signup" element={<SubadminSignup />} />
          <Route path="/subadmin/add-user" element={<AddUserPage />} />
          <Route path="/subadmin/history" element={<HistoryPage />} />
          <Route path="/admin/users" element={<HistoryPage />} />
          {/* <Route path="/subadmin/add-employee" element={<AddEmployee />} /> */}
          <Route path="/subadmin/manage-employees" element={<ManageEmployee />} />
        {/* Dashboard nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="add-user" element={<AddUserPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route index element={<AddUserPage />} /> {/* Default route */}
        </Route>
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}