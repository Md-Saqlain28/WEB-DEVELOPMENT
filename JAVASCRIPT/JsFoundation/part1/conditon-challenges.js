// CHECK WHEATHER  A NUMBER IS GREATER THAN THE OTHER

let num1 = 5
let num2 = 8
console.log("I am a regular upper code");

if (num1 > num2) {
    console.log("num1 is greater!");
    
}else{
    console.log("Nope num1 is not greater");
    
}

console.log("I am a regular lower code");
 

// CHECKING IF A STRING IS EQUAL TO ANOTHER STRING

let username = "Muhammad"
let anotherusername = "Hussain"

if (username != anotherusername) {
    console.log("Pick another user name");
}else{
    console.log("You can pick this username");
}


// Check if a variable is number

let score = 44;

if (typeof score == "number") {
    console.log("Yep, this is a number");
} else {
    console.log("No that is not a number");
}


// CHECKING IF A BOOLEAN VALUE IS TRUE OR FALSE

let isTeaReady = false;

if (isTeaReady) {
    console.log("Tea is Ready");
} else {
    console.log("Tea is NOT ready");
}


// Checking if an array is empty or not

let items = [];

console.log(items.length);

if (items.length === 0) {
    console.log("Array is empty");
    
} else {
    console.log("Array is NOT empty");
    
}