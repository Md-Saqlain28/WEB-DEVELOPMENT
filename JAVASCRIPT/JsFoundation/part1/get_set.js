// Getters and setters

class Employee {
  #salary;
  constructor(name, salary) {
    if (salary < 0) {
      throw new Error("Salary cannot be negetive!!");
    }
    this.name = name;
    this.#salary = salary;
  }

  get salary() {
    return `You Cannot see the salary`;
  }
  set salary(value) {
    if (value < 0) {
      console.error("Invalid Salary");
    } else {
      this._salary = value;
    }
  }
}

let emp = new Employee("Alice", 50000);
console.log(emp._salary);
