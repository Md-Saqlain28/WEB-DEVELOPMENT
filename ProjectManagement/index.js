import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

let myusername = process.env.Username;

let mydatabase = process.env.Database;


console.log("value : " , myusername);
console.log("value : " , mydatabase);

console.log("Start of an awesome project");

