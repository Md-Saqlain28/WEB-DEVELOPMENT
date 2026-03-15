//ABSTRACTION
class coffeeMachine {
  start() {
    //Call Database.
    //Machine Os.
    return `Machine is starting!...`;
  }

  brew() {
    return `Brewing coffee`;
  }

  pressStartButton() {
    let msgone = this.start;
    let msgtwo = this.brew;
    return `${this.start} + ${this.brew}`;
  }
}

let myMachine = new coffeeMachine();
// console.log(myMachine.start());
// console.log(myMachine.brew());
console.log(myMachine.pressStartButton());
