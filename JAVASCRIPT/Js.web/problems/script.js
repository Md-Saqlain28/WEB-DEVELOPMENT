// // EXAMPLE 1
// document.getElementById("clickThis").addEventListener("click", function () {
//   let paragraph = document.getElementById("Mypara");
//   paragraph.textContent = "the paragraph is changed!!";
// });

// // EXAMPLE 2

// document.getElementById("clickMe").addEventListener("click", function () {
//   let citiesList = document.getElementById("citiesList");
//   citiesList.firstElementChild.classList.add("highlight");
// });

//Example 3

// document.getElementById("changeOrder").addEventListener("click", function () {
//   let coffeeType = document.getElementById("coffeeType");
//   coffeeType.textContent = "Espresso";
// });

//Example 4

// document.getElementById("newItem").addEventListener("click", function () {
//   let newItem = document.createElement("li");
//   newItem.textContent = "Eggs";
//   document.getElementById("shoppingList").appendChild(newItem);
// });

//Example 5

document.getElementById("removeTask").addEventListener("click", function () {
  let taskList = document.getElementById("taskList");
  taskList.lastElementChild.remove();
});
