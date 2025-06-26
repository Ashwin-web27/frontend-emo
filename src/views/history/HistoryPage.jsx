import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiArrowRight, FiCheckCircle, FiArrowRightCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
          await fetchUsers(parsedUser.id); // Pass the user ID directly
        } else {
          await fetchUsers(); // Fetch all users if no current user (admin view)
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUsers = async (userId = null) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Filter users based on provided userId (referral ID)
      let filteredUsers = data.data || [];
      if (userId) {
        filteredUsers = filteredUsers.filter(user => 
          user?.referral?._id === userId
        );
      }
      setPeople(filteredUsers.map(user => ({
        id: user._id,
        name: user.firstName,
        surname: user.lastName,
        phone: user.phoneNumber,
        age: user.age,
        city: user.city,
        status: user.status || 'pending',
        referralId: user.referral?._id
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Error loading user data');
    }
  };

  const handleProceed = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'in-progress' })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setPeople(people.map(person => 
        person.id === id ? { ...person, status: 'in-progress' } : person
      ));
      toast.success('Status updated to In Progress');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Error updating status');
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!response.ok) {
        throw new Error('Failed to complete task');
      }

      setPeople(people.map(person => 
        person.id === id ? { ...person, status: 'completed' } : person
      ));
      toast.success('Task marked as completed');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error(error.message || 'Error completing task');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setPeople(people.filter(person => person.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Error deleting user');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiArrowRightCircle className="mr-1" size={12} />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" size={12} />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">
          {currentUser ? 'My Referred Users' : 'All Users Records'}
        </h3>
        <button
          onClick={() => navigate('/dashboard/add-user')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surname</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.length > 0 ? (
              people.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.surname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(person.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {person.status === 'pending' && (
                        <button
                          onClick={() => handleProceed(person.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Proceed"
                        >
                          <FiArrowRight size={16} />
                        </button>
                      )}
                      {person.status !== 'completed' && (
                        <button
                          onClick={() => handleComplete(person.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Complete"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                        onClick={() => navigate(`/edit-user/${person.id}`)}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}