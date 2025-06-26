import React from 'react';

const menuItems = [
  { key: 'addUser', label: 'Add User' },
  { key: 'manageUser', label: 'Manage User' },
  { key: 'addEmployee', label: 'Add Employee' },
  { key: 'manageEmployee', label: 'Manage Employee' },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Sub Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            className={`text-left px-4 py-2 rounded ${
              currentPage === item.key ? 'bg-indigo-700' : 'hover:bg-indigo-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
