# Library Project

A simple web application for managing a personal book collection. This project was built as part of [The Odin Project's](https://www.theodinproject.com/) JavaScript curriculum.

## Features

- **Add Books:** Easily add new books with their title, author, number of pages, and read status through a simple modal form.
- **View Library:** All books are displayed in a clean, organized table.
- **Update Status:** Toggle the read status of a book directly from the library view.
- **Remove Books:** Delete books from the library with a confirmation prompt.
- **Input Validation:** Form validates empty fields and ensures page numbers are positive integers.
- **Auto-capitalization:** Book titles and authors are automatically formatted with proper capitalization.
- **Error Handling:** Robust error handling prevents crashes and provides user feedback.
- **Delete Confirmation:** Confirmation dialog prevents accidental book deletion.
- **Persistent Storage:** Your library is saved to the browser's local storage, so your collection persists between sessions.

## Technologies Used

- HTML5
- CSS3 (Flexbox)
- Vanilla JavaScript (ES6+):
  - Event delegation
  - Template literals
  - Arrow functions
  - Try-catch error handling
  - Crypto API for unique IDs

## User Experience Features

- **Smart Form Handling:** Form automatically resets and focuses on title field after adding books
- **Visual Feedback:** Read status changes are reflected immediately with CSS classes
- **Keyboard Accessible:** Full keyboard navigation support with proper ARIA labels
- **Input Sanitization:** Automatic trimming of whitespace and proper data validation

## Setup

No special build process is required. Simply clone the repository and open the `index.html` file in your web browser.

```bash
git clone https://github.com/your-username/library.git
cd library
# Open index.html in your browser
```

## Acknowledgements

This project was completed as part of the curriculum for The Odin Project.