import React, { useState, useEffect } from 'react';
import { handleDeleteEmployee } from '../../controllers/employee/employeeController';

const ManageEmployee = ({ deleteEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/employee`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setEmployees(data.data);
        } else {
          setError(data.message || 'Failed to fetch employees');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/employee/${employeeId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Update local state after successful deletion
        setEmployees(employees.filter(emp => emp._id !== employeeId));
        if (deleteEmployee) {
          deleteEmployee(employeeId);
        }
      } else {
        setError(result.message || 'Failed to delete employee');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Manage Employees</h3>
      {employees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-indigo-100 text-indigo-900">
              <tr>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Joined Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{employee.fullName}</td>
                  <td className="px-4 py-3">{employee.email}</td>
                  <td className="px-4 py-3">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      aria-label={`Delete employee ${employee.fullName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;