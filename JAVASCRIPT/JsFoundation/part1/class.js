class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  start(){
    return `${this.model} is from ${this.make}`
  }

  drive(){
    return `${this.make} : This is among the best car companies.`
  }
}
let car = new Vehicle("Toyota", "Glanza")
console.log(car);
console.log(car.drive());
console.log(car.start());
