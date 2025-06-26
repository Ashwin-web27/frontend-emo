import React, { useState } from 'react';
import { handleAddEmployee } from '../../controllers/employee/employeeController';

export default function AddEmployee({ addEmployee }) {
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    handleAddEmployee(form, addEmployee);
    setForm({ name: '', email: '', role: '' });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Add Employee</h3>
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <input name="name" value={form.name} onChange={onChange} type="text" placeholder="Employee Name" className="w-full p-2 border rounded" />
        <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input name="role" value={form.role} onChange={onChange} type="text" placeholder="Role" className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add Employee</button>
      </form>
    </div>
  );
}
