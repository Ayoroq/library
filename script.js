// Importing the crypto module for the unique bookid's
// const crypto = require("crypto");

// Main library object where all the books will be stored
const myLibrary = [];

// This is the book constructor for making book objects
function Book(title, author, pages, read) {
  try {
    if (!new.target) {
      throw Error('You must use the "new" keyword to create a book object');
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = Boolean(read);
    this.bookId = crypto.randomUUID();
  } catch (error) {
    console.log(error);
  }
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "read" : "not read"
  }`;
};

function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  saveLibraryToLocalStorage();
  return newBook;
}

function removeBookFromLibrary(bookId) {
  const index = myLibrary.findIndex((book) => book.bookId === bookId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    saveLibraryToLocalStorage()
  }
}

// function to add a new book to the table when the add book is selected
function renderBookRow(book) {
  const tableBody = document.querySelector("tbody");
  const row = document.createElement("tr");
  row.setAttribute("data-book-id", book.bookId);
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.pages}</td>
    <td>
        <select>
        <option value="true" ${book.read ? "selected" : ""}>Read</option>
        <option value="false" ${!book.read ? "selected" : ""}>Not Read</option>
      </select>
    </td>
    <td><button type="button" class="delete-book" aria-label="Delete book">X</button></td>
  `;
  tableBody.appendChild(row);
}

// function to remove row when the delete row button is clicked
function removeBookRow(book){
    removeBookFromLibrary(book.bookId);
    const row = document.querySelector(`[data-book-id="${book.bookId}"]`);
    row.remove();
}

function saveLibraryToLocalStorage() {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

function loadLibraryFromLocalStorage() {
  const storedLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
  storedLibrary.forEach(({ title, author, pages, read, bookId }) => {
    const book = new Book(title, author, pages, read);
    book.bookId = bookId; // restore original ID
    myLibrary.push(book);
    renderBookRow(book);
  });
}

const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".add-book");
const submitButton = document.querySelector(".submit-book");
const deleteButton = document.querySelectorAll(".delete-book");

showButton.addEventListener("click", () => {
  dialog.showModal();
});

// Event to add a book to library and also render
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const readStatus = document.querySelector("#readStatus").value;
  const book = addBookToLibrary(title, author, pages, readStatus);
  renderBookRow(book);
  dialog.close();
});

// Event to delete a row from the table and also remove book 
deleteButton.forEach((button) => {
  button.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    const bookId = row.dataset['data-book-id'];
    const book = myLibrary.find((book) => book.bookId === bookId);
    removeBookRow(book);
    removeBookFromLibrary(book.bookId);
  });
});

loadLibraryFromLocalStorage();