const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
const submitBtn = document.querySelector('.submit-btn');

let editElement;
let editFlag = false;
let editId = "";

form.addEventListener('submit', addItem)


function addItem(e){
    e.preventDefault();
    const value = grocery.value
    const id = new Date().getTime().toString()
    
    if ( value && !editFlag){
        const element = document.createElement('article');
        element.classList.add('grocery-item')
        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr)
        element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
          <button type="button" class="edit-btn">
            <i class="fa fa-edit"></i>
          </button>
          <button type="button" class="delete-btn">
            <i class="fa fa-trash"></i>
          </button>
        </div>`;
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", deleteItem);
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click", editItem);

        list.appendChild(element);
        displayAlert('Task added Successfully', "success");
        container.classList.add('show-container')
        addToLocalStorage(id, value);
        setBackToDefault()
    }
    else if (value && editFlag){
      editElement.innerHTML = value;
      displayAlert('Renamed task with '+value, "success")
      setBackToDefault()
      editLocalStorage(editID, value);
    }
    else{
        displayAlert('Please enter a value', "danger")
    }
}
function deleteItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element)
  if (list.children.length === 0){
    container.classList.remove('show-container')
  }
  const editElement = e.currentTarget.parentElement.previousElementSibling
  displayAlert("Task named -" + editElement.innerHTML + " removed from your tasks", "danger")
  setBackToDefault();
  removeFromLocalStorage(id);
}
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit"
  // console.log(editElement)
}
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 3000)
}
clearBtn.addEventListener('click', clearItems);
function clearItems(){
  const items = document.querySelectorAll(".grocery-item")
  if (items.length > 0){
    items.forEach(function(item){
      list.removeChild(item)
    })
  }
  container.classList.remove("show-container");
  displayAlert("List is cleared", "danger");
  setBackToDefault();
  // localStorage.removeItem("list");
}

function setBackToDefault(){
  grocery.value=""
  editFlag = false
  editId=''
  submitBtn.textContent = "submit"
}
function getLocalStorage(){
  return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[]
}
function addToLocalStorage(id, value){
  const grocery = {id:id, value:value}
  let items = getLocalStorage()
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}