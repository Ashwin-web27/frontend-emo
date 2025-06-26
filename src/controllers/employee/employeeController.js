export function handleAddEmployee(employee, addEmployee) {
  addEmployee(employee);
}

export function handleDeleteEmployee(id, deleteEmployee) {
  if (window.confirm('Delete this employee?')) {
    deleteEmployee(id);
  }
}
