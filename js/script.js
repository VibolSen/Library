
// Data storage keys
const STORAGE_KEYS = {
  books: "library_books",
  visitors: "library_visitors",
  cards: "library_cards",
  bookIdCounter: "book_id_counter",
  visitorIdCounter: "visitor_id_counter",
  cardIdCounter: "card_id_counter",
};

// Utility functions for data management
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCounter(key) {
  return Number.parseInt(localStorage.getItem(key)) || 1;
}

function setCounter(key, value) {
  localStorage.setItem(key, value.toString());
}

// Initialize sample data if none exists
function initializeSampleData() {
  const books = getData(STORAGE_KEYS.books);
  const visitors = getData(STORAGE_KEYS.visitors);

  if (books.length === 0) {
    const sampleBooks = [
      {
        id: 1,
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        publisher: "Scribner",
        pages: 180,
        copies: 5,
      },
      {
        id: 2,
        name: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        publisher: "J.B. Lippincott & Co.",
        pages: 281,
        copies: 3,
      },
      {
        id: 3,
        name: "1984",
        author: "George Orwell",
        year: 1949,
        publisher: "Secker & Warburg",
        pages: 328,
        copies: 4,
      },
    ];

    setData(STORAGE_KEYS.books, sampleBooks);
    setCounter(STORAGE_KEYS.bookIdCounter, 4);
  }

  if (visitors.length === 0) {
    const sampleVisitors = [
      {
        id: 1,
        name: "John Smith",
        phone: "123-456-7890",
      },
      {
        id: 2,
        name: "Jane Doe",
        phone: "098-765-4321",
      },
      {
        id: 3,
        name: "Bob Johnson",
        phone: "555-123-4567",
      },
    ];

    setData(STORAGE_KEYS.visitors, sampleVisitors);
    setCounter(STORAGE_KEYS.visitorIdCounter, 4);
  }
}

// Initialize sample data when the script loads
document.addEventListener("DOMContentLoaded", () => {
  initializeSampleData();
});

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Utility function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

// Export functions for use in other files (if needed)
window.LibraryUtils = {
  getData,
  setData,
  getCounter,
  setCounter,
  formatDate,
  getCurrentDate,
  STORAGE_KEYS,
};

// Data storage
let books = JSON.parse(localStorage.getItem("library_books")) || [];
const visitors = JSON.parse(localStorage.getItem("library_visitors")) || [];
const cards = JSON.parse(localStorage.getItem("library_cards")) || [];

// ID counters
let bookIdCounter =
  Number.parseInt(localStorage.getItem("book_id_counter")) || 1;
let visitorIdCounter =
  Number.parseInt(localStorage.getItem("visitor_id_counter")) || 1;
let cardIdCounter =
  Number.parseInt(localStorage.getItem("card_id_counter")) || 1;

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  showSection("books");
  loadBooks();
  loadVisitors();
  loadCards();
  loadStatistics();
});

// Navigation
function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show selected section
  document.getElementById(sectionName).classList.add("active");

  // Update navigation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));
  event.target.classList.add("active");

  // Load data for the section
  switch (sectionName) {
    case "books":
      loadBooks();
      break;
    case "visitors":
      loadVisitors();
      break;
    case "cards":
      loadCards();
      break;
    case "statistics":
      loadStatistics();
      break;
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("library_books", JSON.stringify(books));
  localStorage.setItem("library_visitors", JSON.stringify(visitors));
  localStorage.setItem("library_cards", JSON.stringify(cards));
  localStorage.setItem("book_id_counter", bookIdCounter.toString());
  localStorage.setItem("visitor_id_counter", visitorIdCounter.toString());
  localStorage.setItem("card_id_counter", cardIdCounter.toString());
}

// BOOKS MANAGEMENT
function loadBooks() {
  const container = document.getElementById("booksList");

  if (books.length === 0) {
    container.innerHTML =
      '<div class="no-data">No books found. Add your first book!</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
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

  books.forEach((book) => {
    html += `
            <tr>
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.publisher}</td>
                <td>${book.pages}</td>
                <td>${book.copies}</td>
                <td class="actions">
                    <button onclick="editBook(${book.id})" class="btn btn-warning">Edit</button>
                    <button onclick="deleteBook(${book.id})" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function showBookForm(bookId = null) {
  const modal = document.getElementById("bookModal");
  const form = document.getElementById("bookForm");
  const title = document.getElementById("bookModalTitle");

  if (bookId) {
    const book = books.find((b) => b.id === bookId);
    title.textContent = "Edit Book";
    document.getElementById("bookId").value = book.id;
    document.getElementById("bookName").value = book.name;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookYear").value = book.year;
    document.getElementById("bookPublisher").value = book.publisher;
    document.getElementById("bookPages").value = book.pages;
    document.getElementById("bookCopies").value = book.copies;
  } else {
    title.textContent = "Add New Book";
    form.reset();
    document.getElementById("bookId").value = "";
  }

  modal.style.display = "block";
}

function closeBookModal() {
  document.getElementById("bookModal").style.display = "none";
}

function editBook(id) {
  showBookForm(id);
}

function deleteBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    books = books.filter((book) => book.id !== id);
    saveData();
    loadBooks();
  }
}

function searchBooks() {
  const searchTerm = document.getElementById("bookSearch").value.toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.publisher.toLowerCase().includes(searchTerm)
  );
  displayFilteredBooks(filteredBooks);
}

function sortBooks() {
  const sortBy = document.getElementById("bookSort").value;
  if (!sortBy) {
    loadBooks();
    return;
  }

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "copies") {
      return b[sortBy] - a[sortBy];
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });

  displayFilteredBooks(sortedBooks);
}

function displayFilteredBooks(bookList) {
  const container = document.getElementById("booksList");

  if (bookList.length === 0) {
    container.innerHTML =
      '<div class="no-data">No books match your search criteria.</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
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
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.publisher}</td>
                <td>${book.pages}</td>
                <td>${book.copies}</td>
                <td class="actions">
                    <button onclick="editBook(${book.id})" class="btn btn-warning">Edit</button>
                    <button onclick="deleteBook(${book.id})" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// Book form submission
document.getElementById("bookForm").addEventListener("submit", (e) => {
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
    alert("All fields are required!");
    return;
  }

  if (bookData.year < 1 || bookData.pages < 1 || bookData.copies < 0) {
    alert("Numeric fields cannot contain negative values!");
    return;
  }

  const bookId = document.getElementById("bookId").value;

  if (bookId) {
    // Edit existing book
    const index = books.findIndex(
      (book) => book.id === Number.parseInt(bookId)
    );
    books[index] = { ...bookData, id: Number.parseInt(bookId) };
  } else {
    // Add new book
    bookData.id = bookIdCounter++;
    books.push(bookData);
  }

  saveData();
  loadBooks();
  closeBookModal();
});

// VISITORS MANAGEMENT
function loadVisitors() {
  const container = document.getElementById("visitorsList");

  if (visitors.length === 0) {
    container.innerHTML =
      '<div class="no-data">No visitors found. Add your first visitor!</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  visitors.forEach((visitor) => {
    html += `
            <tr>
                <td>${visitor.id}</td>
                <td>${visitor.name}</td>
                <td>${visitor.phone}</td>
                <td class="actions">
                    <button onclick="editVisitor(${visitor.id})" class="btn btn-warning">Edit</button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function showVisitorForm(visitorId = null) {
  const modal = document.getElementById("visitorModal");
  const form = document.getElementById("visitorForm");
  const title = document.getElementById("visitorModalTitle");

  if (visitorId) {
    const visitor = visitors.find((v) => v.id === visitorId);
    title.textContent = "Edit Visitor";
    document.getElementById("visitorId").value = visitor.id;
    document.getElementById("visitorName").value = visitor.name;
    document.getElementById("visitorPhone").value = visitor.phone;
  } else {
    title.textContent = "Add New Visitor";
    form.reset();
    document.getElementById("visitorId").value = "";
  }

  modal.style.display = "block";
}

function closeVisitorModal() {
  document.getElementById("visitorModal").style.display = "none";
}

function editVisitor(id) {
  showVisitorForm(id);
}

function searchVisitors() {
  const searchTerm = document
    .getElementById("visitorSearch")
    .value.toLowerCase();
  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm) ||
      visitor.phone.includes(searchTerm)
  );
  displayFilteredVisitors(filteredVisitors);
}

function sortVisitors() {
  const sortBy = document.getElementById("visitorSort").value;
  if (!sortBy) {
    loadVisitors();
    return;
  }

  const sortedVisitors = [...visitors].sort((a, b) => {
    if (sortBy === "id") {
      return a.id - b.id;
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });

  displayFilteredVisitors(sortedVisitors);
}

function displayFilteredVisitors(visitorList) {
  const container = document.getElementById("visitorsList");

  if (visitorList.length === 0) {
    container.innerHTML =
      '<div class="no-data">No visitors match your search criteria.</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  visitorList.forEach((visitor) => {
    html += `
            <tr>
                <td>${visitor.id}</td>
                <td>${visitor.name}</td>
                <td>${visitor.phone}</td>
                <td class="actions">
                    <button onclick="editVisitor(${visitor.id})" class="btn btn-warning">Edit</button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// Visitor form submission
document.getElementById("visitorForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const visitorData = {
    name: document.getElementById("visitorName").value.trim(),
    phone: document.getElementById("visitorPhone").value.trim(),
  };

  // Validation
  if (!visitorData.name || !visitorData.phone) {
    alert("All fields are required!");
    return;
  }

  // Phone validation (only numbers, spaces, and dashes)
  const phoneRegex = /^[0-9\s-]+$/;
  if (!phoneRegex.test(visitorData.phone)) {
    alert("Phone number must contain only numbers, spaces, and dashes!");
    return;
  }

  const visitorId = document.getElementById("visitorId").value;

  if (visitorId) {
    // Edit existing visitor
    const index = visitors.findIndex(
      (visitor) => visitor.id === Number.parseInt(visitorId)
    );
    visitors[index] = { ...visitorData, id: Number.parseInt(visitorId) };
  } else {
    // Add new visitor
    visitorData.id = visitorIdCounter++;
    visitors.push(visitorData);
  }

  saveData();
  loadVisitors();
  closeVisitorModal();
});

// CARDS MANAGEMENT
function loadCards() {
  const container = document.getElementById("cardsList");

  if (cards.length === 0) {
    container.innerHTML =
      '<div class="no-data">No library cards found. Lend your first book!</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Visitor</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  cards.forEach((card) => {
    const visitor = visitors.find((v) => v.id === card.visitorId);
    const book = books.find((b) => b.id === card.bookId);

    html += `
            <tr>
                <td>${card.id}</td>
                <td>${visitor ? visitor.name : "Unknown"}</td>
                <td>${book ? book.name : "Unknown"}</td>
                <td>${card.borrowDate}</td>
                <td>${card.returnDate || ""}</td>
                <td class="actions">
                    ${
                      !card.returnDate
                        ? `<button onclick="returnBook(${card.id})" class="btn btn-success">Return</button>`
                        : "Returned"
                    }
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function showCardForm() {
  const modal = document.getElementById("cardModal");
  const visitorSelect = document.getElementById("cardVisitor");
  const bookSelect = document.getElementById("cardBook");
  const borrowDateInput = document.getElementById("cardBorrowDate");

  // Populate visitors dropdown
  visitorSelect.innerHTML = '<option value="">Select a visitor...</option>';
  visitors.forEach((visitor) => {
    visitorSelect.innerHTML += `<option value="${visitor.id}">${visitor.name}</option>`;
  });

  // Populate books dropdown (only available books)
  bookSelect.innerHTML = '<option value="">Select a book...</option>';
  books
    .filter((book) => book.copies > 0)
    .forEach((book) => {
      bookSelect.innerHTML += `<option value="${book.id}">${book.name} (${book.copies} available)</option>`;
    });

  // Set current date
  const today = new Date().toISOString().split("T")[0];
  borrowDateInput.value = today;

  modal.style.display = "block";
}

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
}

function returnBook(cardId) {
  const card = cards.find((c) => c.id === cardId);
  if (card && !card.returnDate) {
    card.returnDate = new Date().toISOString().split("T")[0];

    // Increase book copies
    const book = books.find((b) => b.id === card.bookId);
    if (book) {
      book.copies++;
    }

    saveData();
    loadCards();
    loadBooks(); // Refresh books list to show updated copies
  }
}

function searchCards() {
  const searchTerm = document.getElementById("cardSearch").value.toLowerCase();
  const filteredCards = cards.filter((card) => {
    const visitor = visitors.find((v) => v.id === card.visitorId);
    const book = books.find((b) => b.id === card.bookId);

    return (
      (visitor && visitor.name.toLowerCase().includes(searchTerm)) ||
      (book && book.name.toLowerCase().includes(searchTerm)) ||
      card.borrowDate.includes(searchTerm) ||
      (card.returnDate && card.returnDate.includes(searchTerm))
    );
  });
  displayFilteredCards(filteredCards);
}

function sortCards() {
  const sortBy = document.getElementById("cardSort").value;
  if (!sortBy) {
    loadCards();
    return;
  }

  const sortedCards = [...cards].sort((a, b) => {
    if (sortBy === "borrowDate") {
      return new Date(b.borrowDate) - new Date(a.borrowDate);
    } else if (sortBy === "visitorName") {
      const visitorA = visitors.find((v) => v.id === a.visitorId);
      const visitorB = visitors.find((v) => v.id === b.visitorId);
      return (visitorA?.name || "").localeCompare(visitorB?.name || "");
    } else if (sortBy === "bookName") {
      const bookA = books.find((b) => b.id === a.bookId);
      const bookB = books.find((b) => b.id === b.bookId);
      return (bookA?.name || "").localeCompare(bookB?.name || "");
    }
    return 0;
  });

  displayFilteredCards(sortedCards);
}

function displayFilteredCards(cardList) {
  const container = document.getElementById("cardsList");

  if (cardList.length === 0) {
    container.innerHTML =
      '<div class="no-data">No cards match your search criteria.</div>';
    return;
  }

  let html = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Visitor</th>
                    <th>Book</th>
                    <th>Borrow Date</th>
                    <th>Return Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

  cardList.forEach((card) => {
    const visitor = visitors.find((v) => v.id === card.visitorId);
    const book = books.find((b) => b.id === card.bookId);

    html += `
            <tr>
                <td>${card.id}</td>
                <td>${visitor ? visitor.name : "Unknown"}</td>
                <td>${book ? book.name : "Unknown"}</td>
                <td>${card.borrowDate}</td>
                <td>${card.returnDate || ""}</td>
                <td class="actions">
                    ${
                      !card.returnDate
                        ? `<button onclick="returnBook(${card.id})" class="btn btn-success">Return</button>`
                        : "Returned"
                    }
                </td>
            </tr>
        `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

// Card form submission
document.getElementById("cardForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const cardData = {
    visitorId: Number.parseInt(document.getElementById("cardVisitor").value),
    bookId: Number.parseInt(document.getElementById("cardBook").value),
    borrowDate: document.getElementById("cardBorrowDate").value,
    returnDate: null,
  };

  // Validation
  if (!cardData.visitorId || !cardData.bookId) {
    alert("Please select both visitor and book!");
    return;
  }

  // Check if book is available
  const book = books.find((b) => b.id === cardData.bookId);
  if (!book || book.copies <= 0) {
    alert("This book is not available!");
    return;
  }

  // Decrease book copies
  book.copies--;

  // Add new card
  cardData.id = cardIdCounter++;
  cards.push(cardData);

  saveData();
  loadCards();
  loadBooks(); // Refresh books list to show updated copies
  closeCardModal();
});

// STATISTICS
function loadStatistics() {
  loadPopularBooks();
  loadActiveVisitors();
}

function loadPopularBooks() {
  const container = document.getElementById("popularBooks");

  // Count how many times each book was borrowed
  const bookStats = {};
  cards.forEach((card) => {
    if (bookStats[card.bookId]) {
      bookStats[card.bookId]++;
    } else {
      bookStats[card.bookId] = 1;
    }
  });

  // Sort books by borrow count
  const sortedBooks = Object.entries(bookStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([bookId, count]) => {
      const book = books.find((b) => b.id === Number.parseInt(bookId));
      return { book, count };
    });

  if (sortedBooks.length === 0) {
    container.innerHTML =
      '<div class="no-data">No borrowing data available.</div>';
    return;
  }

  let html = "";
  sortedBooks.forEach((item, index) => {
    if (item.book) {
      html += `
                <div class="stats-item">
                    <span>${index + 1}. ${item.book.name}</span>
                    <span>${item.count} times borrowed</span>
                </div>
            `;
    }
  });

  container.innerHTML = html;
}

function loadActiveVisitors() {
  const container = document.getElementById("activeVisitors");

  // Count how many books each visitor borrowed
  const visitorStats = {};
  cards.forEach((card) => {
    if (visitorStats[card.visitorId]) {
      visitorStats[card.visitorId]++;
    } else {
      visitorStats[card.visitorId] = 1;
    }
  });

  // Sort visitors by borrow count
  const sortedVisitors = Object.entries(visitorStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([visitorId, count]) => {
      const visitor = visitors.find((v) => v.id === Number.parseInt(visitorId));
      return { visitor, count };
    });

  if (sortedVisitors.length === 0) {
    container.innerHTML =
      '<div class="no-data">No borrowing data available.</div>';
    return;
  }

  let html = "";
  sortedVisitors.forEach((item, index) => {
    if (item.visitor) {
      html += `
                <div class="stats-item">
                    <span>${index + 1}. ${item.visitor.name}</span>
                    <span>${item.count} books borrowed</span>
                </div>
            `;
    }
  });

  container.innerHTML = html;
}

// Close modals when clicking outside
window.onclick = (event) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};
