// Importing the crypto module for the unique bookid's
const crypto = require("crypto");

// Main library object where all the books will be stored
const myLibrary = [];

// This is the book constructor for making book objects
function Book(title, author, pages,read) {
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
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read"}`;
};

function addBookToLibrary(title, author, pages, read) {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    return newBook.bookId;
}

function removeBookFromLibrary(bookId) {
    const index = myLibrary.findIndex((book) => book.bookId === bookId);
    if (index !== -1) {
        myLibrary.splice(index, 1);
    }
}


addBookToLibrary("Ender's Game", "Orson Scott Card", 324, true);
addBookToLibrary("The First Fifteen Lives of Harry August", "Claire North", 405, true);
addBookToLibrary("Neuromancer", "William Gibson", 271, false);
addBookToLibrary("1984", "George Orwell", 328, true);
