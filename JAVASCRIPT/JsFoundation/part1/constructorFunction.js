function Car(company, model) {
  this.company = company;
  this.model = model;
}

let Mycar = new Car("Toyota", "Corolla");
// console.log(Mycar);

let MyCar = new Car("Maruti Suzuki", "D Zire");
// console.log(MyCar);

function Tea(type) {
  this.type = type;
  this.describe = function () {
    return `This is cup of ${this.type}`;
  };
}

let TEA = new Tea("Black tea.");
// console.log(TEA.describe());

function Animal(species) {
  this.species = species;
}
Animal.prototype.sound = function () {
  return `${this.species} makes a sound`;
};
let dog = new Animal("Dog");
// console.log(dog.sound());

let cat = new Animal("Cat");
// console.log(cat.sound());

function Drink(name) {
  if (!new.target) {
    throw new Error("Drink must be called with the new keyword!!");
  }
  this.name = name;
}

let drink = new Drink("Tea");
console.log(drink);
