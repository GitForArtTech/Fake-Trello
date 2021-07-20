const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const body = document.body;
let select = document.getElementById("background");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updateOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentCol;
let dragging = false;
// changeBackground()
function changeBackground() {
  let value = select.options[select.selectedIndex].value;
  body.style.backgroundImage = `url('./background/${value}.jpg')`;
  // switch (e.target.value){
  //   case "dafault":
  // body.style.backgroundImage ="url"
  // }
}

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arraysName = ["backlog", "progress", "complete", "onHold"];
  arraysName.forEach((arrName, index) => {
    localStorage.setItem(`${arrName}Items`, JSON.stringify(listArrays[index]));
  });
}
//filter arrays to remove empty items
function filterArray(arr) {
  const filterArr = arr.filter((item) => item != null);
  return filterArr;
}

// Create DOM Elements for each list item,
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);

  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
}
//update item - deleete if necessary , or update array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// addToColumn list , reset textbox
function addToColumn(col) {
  const itemText = addItems[col].textContent;
  const selectedArray = listArrays[col];
  selectedArray.push(itemText);
  addItems[col].textContent = "";
  updateDOM();
}

//show add item input box
function showInputBox(col) {
  addBtns[col].style.visibility = "hidden";
  saveItemBtns[col].style.display = "flex";
  addItemContainers[col].style.display = "flex";
}
//hide add item input box
function hideInputBox(col) {
  addBtns[col].style.visibility = "visible";
  saveItemBtns[col].style.display = "none";
  addItemContainers[col].style.display = "none";
  addToColumn(col);
}
//allow arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray = [];
  progressListArray = [];
  completeListArray = [];
  onHoldListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// when item drag
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
//col allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}
// when item into col area
function dragEnter(col) {
  listColumns[col].classList.add("over");
  currentCol = col;
}

// drop item in col
function drop(e) {
  e.preventDefault();
  //remove background color within draging
  listColumns.forEach((col) => {
    col.classList.remove("over");
  });
  // add items to col
  const parent = listColumns[currentCol];
  parent.appendChild(draggedItem);
  //Dragging complete
  dragging = false;
  rebuildArrays();
}
//on Load
updateDOM();
