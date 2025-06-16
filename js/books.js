// Books page functionality
let editingBookId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadBooks();
  setupEventListeners();
});

function setupEventListeners() {
  const bookModal = document.getElementById("bookModal");
  const addBookBtn = document.getElementById("addBookBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const bookForm = document.getElementById("bookForm");

  // Open modal to ADD a new book
  addBookBtn.addEventListener("click", () => {
    resetBookFormForAdd();
    openBookModal();
  });

  // Close modal with buttons
  closeFormBtn.addEventListener("click", closeBookModal);
  cancelFormBtn.addEventListener("click", closeBookModal);

  // Close modal by clicking the overlay
  bookModal.addEventListener("click", (e) => {
    if (e.target === bookModal) {
      closeBookModal();
    }
  });

  // Close modal with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookModal.classList.contains("show")) {
      closeBookModal();
    }
  });

  // Form submission
  bookForm.addEventListener("submit", handleBookSubmit);

  // Search and sort
  document.getElementById("bookSearch").addEventListener("keyup", searchBooks);
  document.getElementById("bookSort").addEventListener("change", sortBooks);
}

function openBookModal() {
  const bookModal = document.getElementById("bookModal");
  bookModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeBookModal() {
  const bookModal = document.getElementById("bookModal");
  bookModal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function resetBookFormForAdd() {
  editingBookId = null;
  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  document.getElementById("bookFormTitle").innerHTML =
    '<i class="fas fa-plus-circle"></i> Add New Book';
}

function handleBookSubmit(e) {
  e.preventDefault();

  const bookData = {
    name: document.getElementById("bookName").value.trim(),
    author: document.getElementById("bookAuthor").value.trim(),
    year: Number.parseInt(document.getElementById("bookYear").value),
    publisher: document.getElementById("bookPublisher").value.trim(),
    pages: Number.parseInt(document.getElementById("bookPages").value),
    copies: Number.parseInt(document.getElementById("bookCopies").value),
  };

  // Validation
  if (!bookData.name || !bookData.author || !bookData.publisher) {
    notification.error("All fields are required!");
    return;
  }

  if (
    isNaN(bookData.year) ||
    isNaN(bookData.pages) ||
    isNaN(bookData.copies) ||
    bookData.year < 1 ||
    bookData.pages < 1 ||
    bookData.copies < 0
  ) {
    notification.error(
      "Numeric fields must contain valid, non-negative numbers!"
    );
    return;
  }

  const bookId = document.getElementById("bookId").value;
  let result;

  if (bookId) {
    // Edit existing book
    result = dataManager.updateBook(Number.parseInt(bookId), bookData);
    if (result) {
      notification.success("Book updated successfully!");
    } else {
      notification.error("Failed to update book!");
      return;
    }
  } else {
    // Add new book
    result = dataManager.addBook(bookData);
    if (result) {
      notification.success("Book added successfully!");
    } else {
      notification.error("Failed to add book!");
      return;
    }
  }

  loadBooks();
  closeBookModal();
}

function loadBooks() {
  const books = dataManager.getBooks();
  displayBooks(books);
}

function displayBooks(bookList) {
  const container = document.getElementById("booksList");
  const countBadge = document.getElementById("booksCount");

  countBadge.textContent = `${bookList.length} books`;

  if (bookList.length === 0) {
    container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-book-open"></i>
                <h3>No books found</h3>
                <p>Add your first book to get started!</p>
            </div>
        `;
    return;
  }

  let html = `
        <div class="table-container">
            <table class="fancy-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Book Name</th>
                        <th>Author</th>
                        <th>Year</th>
                        <th>Publisher</th>
                        <th>Pages</th>
                        <th>Copies</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

  bookList.forEach((book) => {
    html += `
            <tr>
                <td><span class="id-badge">${book.id}</span></td>
                <td><strong>${book.name}</strong></td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.publisher}</td>
                <td>${book.pages}</td>
                <td><span class="copies-badge">${book.copies}</span></td>
                <td class="actions">
                    <button onclick="editBook(${book.id})" class="btn btn-warning btn-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBook(${book.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table></div>";
  container.innerHTML = html;
}

function editBook(id) {
  const book = dataManager.getBookById(id);

  if (book) {
    document.getElementById("bookId").value = book.id;
    document.getElementById("bookName").value = book.name;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookYear").value = book.year;
    document.getElementById("bookPublisher").value = book.publisher;
    document.getElementById("bookPages").value = book.pages;
    document.getElementById("bookCopies").value = book.copies;

    document.getElementById("bookFormTitle").innerHTML =
      '<i class="fas fa-edit"></i> Edit Book';
    editingBookId = id;

    openBookModal();
  }
}

function deleteBook(id) {
  if (
    confirm(
      "Are you sure you want to delete this book? This action cannot be undone."
    )
  ) {
    if (dataManager.deleteBook(id)) {
      loadBooks();
      notification.success("Book deleted successfully!");
    } else {
      notification.error("Failed to delete book!");
    }
  }
}

function searchBooks() {
  const searchTerm = document.getElementById("bookSearch").value.toLowerCase();
  const books = dataManager.getBooks();

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.publisher.toLowerCase().includes(searchTerm)
  );

  displayBooks(filteredBooks);
}

function sortBooks() {
  const sortBy = document.getElementById("bookSort").value;
  if (!sortBy) {
    loadBooks();
    return;
  }

  const books = dataManager.getBooks();
  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "copies") {
      return b[sortBy] - a[sortBy];
    }
    // Default to string comparison
    const valA = String(a[sortBy] || "").toLowerCase();
    const valB = String(b[sortBy] || "").toLowerCase();
    return valA.localeCompare(valB);
  });

  displayBooks(sortedBooks);
}
