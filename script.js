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
    throw error;
  }
}

// Returns formatted book information string
Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.read ? "read" : "not read"
  }`;
};

// Toggles the read status of a book
Book.prototype.toggleRead = function () {
  this.read = !this.read;
  saveLibraryToLocalStorage();
};

// Creates a new book and adds it to the library
function addBookToLibrary(title, author, pages, read) {
  try {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    saveLibraryToLocalStorage();
    return newBook;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Removes a book from the library by bookId
function removeBookFromLibrary(bookId) {
  try {
    const index = myLibrary.findIndex((book) => book.bookId === bookId);
    if (index !== -1) {
      myLibrary.splice(index, 1);
      saveLibraryToLocalStorage();
    }
  } catch (error) {
    console.log(error);
  }
}

// Validates form input data
function validateInput(title, author, pages) {
  if (!title.trim()) {
    alert("Title cannot be empty");
    return false;
  }
  if (!author.trim()) {
    alert("Author cannot be empty");
    return false;
  }
  if (!pages || isNaN(pages) || parseInt(pages) <= 0) {
    alert("Pages must be a positive number");
    return false;
  }
  return true;
}

// function to find book by ID
function findBookById(bookId) {
  return myLibrary.find((book) => book.bookId === bookId);
}

// function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  try {
    const allWords = string.split(" ");
    const capitalizedWords = allWords.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(" ");
  } catch (error) {
    console.log(error);
    return string;
  }
}

// function to add a new book to the table when the add book is selected
function renderBookRow(book) {
  try {
    const tableBody = document.querySelector("tbody");
    const row = document.createElement("tr");
    row.setAttribute("data-book-id", book.bookId);
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>
          <select class="read-status">
          <option value="true" ${book.read ? "selected" : ""}>Read</option>
          <option value="false" ${
            !book.read ? "selected" : ""
          }>Not Read</option>
        </select>
      </td>
      <td><button type="button" class="delete-book" aria-label="Delete book">&#x2715;</button></td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.log(error);
  }
}

// function to remove row when the delete row button is clicked
function removeBookRow(book) {
  try {
    removeBookFromLibrary(book.bookId);
    const row = document.querySelector(`[data-book-id="${book.bookId}"]`);
    row.remove();
  } catch (error) {
    console.log(error);
  }
}

// Saves the current library to localStorage
function saveLibraryToLocalStorage() {
  try {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  } catch (error) {
    console.log(error);
  }
}

// Loads library from localStorage and renders books
function loadLibraryFromLocalStorage() {
  try {
    const storedLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
    storedLibrary.forEach(({ title, author, pages, read, bookId }) => {
      const book = new Book(title, author, pages, read);
      book.bookId = bookId; // restore original ID
      myLibrary.push(book);
      renderBookRow(book);
    });
  } catch (error) {
    console.log(error);
  }
}

const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".add-book");
const submitButton = document.querySelector(".submit-book");

// Event handler to show the add book dialog
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// Event to add a book to library and also render
submitButton.addEventListener("click", (event) => {
  try {
    event.preventDefault();
    const titleValue = document.querySelector("#title").value;
    const authorValue = document.querySelector("#author").value;
    const pagesValue = document.querySelector("#pages").value;
    const readStatus = document.querySelector("#readStatus").value;

    if (!validateInput(titleValue, authorValue, pagesValue)) {
      return;
    }

    const title = capitalizeFirstLetter(titleValue.trim());
    const author = capitalizeFirstLetter(authorValue.trim());
    const pages = parseInt(pagesValue);

    const book = addBookToLibrary(title, author, pages, readStatus === "true");
    if (!book) {
      alert("Failed to add book. Please try again.");
      return;
    }
    
    renderBookRow(book);

    // Reset form and close dialog
    document.querySelector("#form").reset();
    dialog.close();
    document.querySelector("#title").focus();
  } catch (error) {
    console.log(error);
  }
});

// Event to delete a row from the table and also remove book
document.querySelector("tbody").addEventListener("click", (event) => {
  try {
    if (event.target.classList.contains("delete-book")) {
      const row = event.target.closest("tr");
      const bookId = row.dataset.bookId;
      const book = findBookById(bookId);
      if (book) {
        removeBookRow(book);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Event to toggle the read status of a book using event delegation
document.querySelector("tbody").addEventListener("change", (event) => {
  try {
    if (event.target.classList.contains("read-status")) {
      const row = event.target.closest("tr");
      const bookId = row.dataset.bookId;
      const book = findBookById(bookId);
      if (book) {
        book.toggleRead();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Load saved books when page loads
loadLibraryFromLocalStorage();
