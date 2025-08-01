// This is the book constructor for making book objects
class Book {
  #bookId;

  constructor(title, author, pages, read, existingId = null) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = Boolean(read);
    this.#bookId = existingId || crypto.randomUUID();
  }

  get bookId() {
    return this.#bookId;
  }

  // provides information about the book
  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read"
    }`;
  }

  // toggles the read status of book
  toggleRead() {
    this.read = !this.read;
    library.saveLibraryToLocalStorage();
  }
}

class Library {
  #books = [];

  // Creates a new book and adds it to the library
  addBookToLibrary(title, author, pages, read) {
    try {
      const newBook = new Book(title, author, pages, read);
      this.#books.push(newBook);
      this.saveLibraryToLocalStorage();
      return newBook;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  get books() {
    return [...this.#books];
  }

  // Removes a book from the library by bookId
  removeBookFromLibrary(bookId) {
    try {
      const index = this.#books.findIndex((book) => book.bookId === bookId);
      if (index !== -1) {
        this.#books.splice(index, 1);
        this.saveLibraryToLocalStorage();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Saves the current library to localStorage
  saveLibraryToLocalStorage() {
    try {
      localStorage.setItem("myLibrary", JSON.stringify(this.#books));
    } catch (error) {
      console.log(error);
    }
  }

  // Loads library from localStorage and renders books
  loadLibraryFromLocalStorage() {
    try {
      const storedLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
      storedLibrary.forEach(({ title, author, pages, read, bookId }) => {
        const book = new Book(title, author, pages, read, bookId);
        this.#books.push(book);
        new BookRow(book).renderBookRow();
      });
    } catch (error) {
      console.log(error);
    }
  }
  // Finds a book by bookId
  findBookById(bookId) {
    return this.#books.find((book) => book.bookId === bookId);
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

// function to capitalize the first letter of each word
function capitalizeFirstLetter(string) {
  try {
    const allWords = string.split(" ");
    const capitalizedWords = allWords.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(" ");
  } catch (error) {
    console.log(error);
    return string;
  }
}

class BookRow {
  constructor(book) {
    this.book = book;
  }

  renderBookRow() {
    try {
      const row = document.createElement("tr");
      this.row = row;
      this.row.setAttribute("data-book-id", this.book.bookId);
      this.row.innerHTML = `
      <td class="book-title">${this.book.title}</td>
      <td class="book-author">${this.book.author}</td>
      <td class="book-pages">${this.book.pages}</td>
      <td class="book-read">
          <select class="read-status ${this.book.read ? "read" : "not-read"}">
          <option value="true" ${this.book.read ? "selected" : ""}>Read</option>
          <option value="false" ${
            !this.book.read ? "selected" : ""
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

  removeBookRow() {
    try {
       library.removeBookFromLibrary(this.book.bookId);
      const row = document.querySelector(
        `[data-book-id="${this.book.bookId}"]`
      );
      this.row = row;
      this.row.remove();
    } catch (error) {
      console.log(error);
    }
  }
}

//DOM elements
const library = new Library();
const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".add-book");
const submitButton = document.querySelector(".submit-book");
const form = document.querySelector("#form");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const readStatusSelect = document.querySelector("#readStatus");
const tableBody = document.querySelector("tbody");

// Event handler to show the add book dialog
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// Event to add a book to library and also render
submitButton.addEventListener("click", (event) => {
  try {
    event.preventDefault();
    const titleValue = titleInput.value;
    const authorValue = authorInput.value;
    const pagesValue = pagesInput.value;
    const readStatus = readStatusSelect.value;

    if (!validateInput(titleValue, authorValue, pagesValue)) {
      return;
    }

    const title = capitalizeFirstLetter(titleValue.trim());
    const author = capitalizeFirstLetter(authorValue.trim());
    const pages = parseInt(pagesValue);

    const book =  library.addBookToLibrary(title, author, pages, readStatus === "true");
    if (!book) {
      alert("Failed to add book. Please try again.");
      return;
    }

    new BookRow(book).renderBookRow();

    // Reset form and close dialog
    form.reset();
    dialog.close();
    titleInput.focus();
  } catch (error) {
    console.log(error);
  }
});

// Event to delete a row from the table and also remove book
tableBody.addEventListener("click", (event) => {
  try {
    if (event.target.classList.contains("delete-book")) {
      const row = event.target.closest("tr");
      const bookId = row.dataset.bookId;
      const book = library.findBookById(bookId);
      if (book && confirm(`Are you sure you want to delete "${book.title}"?`)) {
        new BookRow(book).removeBookRow();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Event to toggle the read status of a book using event delegation
tableBody.addEventListener("change", (event) => {
  try {
    if (event.target.classList.contains("read-status")) {
      const select = event.target;
      const row = select.closest("tr");
      const bookId = row.dataset.bookId;
      const book = library.findBookById(bookId);
      if (book) {
        book.toggleRead();
      }

      // Remove old class
      select.classList.remove("read", "not-read");

      // Add new class based on value
      if (select.value === "true") {
        select.classList.add("read");
      } else {
        select.classList.add("not-read");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Load saved books when page loads
library.loadLibraryFromLocalStorage();
