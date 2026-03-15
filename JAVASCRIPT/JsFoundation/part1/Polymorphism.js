//Polymorphism

class Bird {
  fly() {
    return `Flying.....`;
  }
}

class Penguin extends Bird {
  fly() {
    return `Can't fly!!!!!`;
  }
}

let bird = new Bird();
let penguin = new Penguin();
// console.log(bird.fly());
// console.log(penguin.fly());

// Statics

class Calculator {
  static add(a, b) {
    return a + b;
  }
}

let Calc = new Calculator();
// console.log(Calc.add(2,3));
console.log(Calculator.add(2,3));
