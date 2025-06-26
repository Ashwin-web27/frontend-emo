export class Employee {
  constructor(id, name, surname, phone, age, city, status = 'pending') {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.age = age;
    this.city = city;
    this.status = status;
  }
}

// Sample data
export const employees = [
  new Employee(1, 'John', 'Doe', '555-123-4567', 32, 'New York'),
  new Employee(2, 'Sarah', 'Smith', '555-987-6543', 28, 'Los Angeles'),
  new Employee(3, 'Michael', 'Johnson', '555-456-7890', 45, 'Chicago'),
  new Employee(4, 'Emily', 'Williams', '555-789-0123', 29, 'Houston')
];