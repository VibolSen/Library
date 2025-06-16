// Cards page functionality
document.addEventListener("DOMContentLoaded", () => {
  loadCards();
  setupEventListeners();
});

function setupEventListeners() {
  const cardModal = document.getElementById("cardModal");
  const lendBookBtn = document.getElementById("lendBookBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const cardForm = document.getElementById("cardForm");

  // Open modal to lend a book
  lendBookBtn.addEventListener("click", openCardModal);

  // Close modal with buttons
  closeFormBtn.addEventListener("click", closeCardModal);
  cancelFormBtn.addEventListener("click", closeCardModal);

  // Close modal by clicking the overlay
  cardModal.addEventListener("click", (e) => {
    if (e.target === cardModal) {
      closeCardModal();
    }
  });

  // Close modal with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cardModal.classList.contains("show")) {
      closeCardModal();
    }
  });

  // Form submission
  cardForm.addEventListener("submit", handleCardSubmit);

  // Search and sort
  document.getElementById("cardSearch").addEventListener("keyup", searchCards);
  document.getElementById("cardSort").addEventListener("change", sortCards);
}

function openCardModal() {
  const cardModal = document.getElementById("cardModal");
  populateFormDropdowns();
  cardModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeCardModal() {
  const cardModal = document.getElementById("cardModal");
  document.getElementById("cardForm").reset();
  cardModal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function populateFormDropdowns() {
  const visitors = window.dataManager.getVisitors();
  const books = window.dataManager.getBooks();

  const visitorSelect = document.getElementById("cardVisitor");
  const bookSelect = document.getElementById("cardBook");

  if (!visitorSelect || !bookSelect) {
    console.error("Visitor or Book select dropdown not found in form!");
    return;
  }

  visitorSelect.innerHTML = '<option value="">Choose a visitor...</option>';
  visitors.forEach((visitor) => {
    visitorSelect.innerHTML += `<option value="${visitor.id}">${visitor.name} (ID: ${visitor.id})</option>`;
  });

  bookSelect.innerHTML = '<option value="">Choose a book...</option>';
  books
    .filter((book) => book.copies > 0) // Only show books with available copies
    .forEach((book) => {
      bookSelect.innerHTML += `<option value="${book.id}">${book.name} (${book.copies} available)</option>`;
    });

  document.getElementById("cardBorrowDate").value =
    window.dataManager.getCurrentDate();
}

function handleCardSubmit(e) {
  e.preventDefault();

  const visitorIdValue = document.getElementById("cardVisitor").value;
  const bookIdValue = document.getElementById("cardBook").value;

  if (!visitorIdValue || !bookIdValue) {
    window.notification.error("Please select both visitor and book!");
    return;
  }

  const cardData = {
    visitorId: Number.parseInt(visitorIdValue),
    bookId: Number.parseInt(bookIdValue),
  };

  const book = window.dataManager.getBookById(cardData.bookId);
  if (!book || book.copies <= 0) {
    window.notification.error("This book is not available or does not exist!");
    populateFormDropdowns();
    return;
  }

  // Decrement book copy before adding card
  book.copies--;
  window.dataManager.updateBook(book.id, book);

  const result = window.dataManager.addCard(cardData);
  if (result) {
    loadCards();
    closeCardModal();
    window.notification.success("Book lent successfully!");
  } else {
    // If addCard failed, revert the copy count
    book.copies++;
    window.dataManager.updateBook(book.id, book);
    window.notification.error("Failed to lend book! Please try again.");
  }
}

function loadCards() {
  const cards = window.dataManager.getCards();
  displayCards(cards);
}

function displayCards(cardList) {
  const container = document.getElementById("cardsList");
  const countBadge = document.getElementById("cardsCount");

  if (!container || !countBadge) {
    console.error("Cards list container or count badge not found!");
    return;
  }

  countBadge.textContent = `${cardList.length} card${
    cardList.length === 1 ? "" : "s"
  }`;

  if (cardList.length === 0) {
    container.innerHTML = `
            <div class="no-data">
                <i class="fas fa-id-card"></i>
                <h3>No library cards found</h3>
                <p>Lend your first book to get started!</p>
            </div>
        `;
    return;
  }

  const visitors = window.dataManager.getVisitors();
  const books = window.dataManager.getBooks();

  let html = `
        <div class="table-container">
            <table class="fancy-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Visitor</th>
                        <th>Book</th>
                        <th>Borrow Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

  const sortedCardList = [...cardList].sort(
    (a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)
  );

  sortedCardList.forEach((card) => {
    const visitor = visitors.find((v) => v.id === card.visitorId);
    const book = books.find((b) => b.id === card.bookId);
    const isReturned = card.returnDate !== null;

    html += `
            <tr>
                <td><span class="id-badge">${card.id}</span></td>
                <td><strong>${
                  visitor
                    ? visitor.name
                    : `Unknown Visitor (ID: ${card.visitorId})`
                }</strong></td>
                <td>${
                  book ? book.name : `Unknown Book (ID: ${card.bookId})`
                }</td>
                <td>${window.dataManager.formatDate(card.borrowDate)}</td>
                <td>${
                  isReturned
                    ? window.dataManager.formatDate(card.returnDate)
                    : "-"
                }</td>
                <td>
                    <span class="status-badge ${
                      isReturned ? "returned" : "borrowed"
                    }">
                        <i class="fas ${
                          isReturned ? "fa-check-circle" : "fa-clock"
                        }"></i>
                        ${isReturned ? "Returned" : "Borrowed"}
                    </span>
                </td>
                <td class="actions">
                    ${
                      !isReturned
                        ? `
                        <button onclick="returnBook(${card.id})" class="btn btn-success btn-sm">
                            <i class="fas fa-undo"></i> Return
                        </button>
                    `
                        : '<span class="text-muted">Completed</span>'
                    }
                    <button onclick="deleteCard(${
                      card.id
                    })" class="btn btn-danger btn-sm" style="margin-left: 5px;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
  });

  html += "</tbody></table></div>";
  container.innerHTML = html;
}

function returnBook(cardId) {
  const result = window.dataManager.returnBook(cardId);
  if (result) {
    loadCards();
    window.notification.success("Book returned successfully!");
  } else {
    window.notification.error(
      "Failed to return book! It might already be returned or card not found."
    );
  }
}

function deleteCard(cardId) {
  if (
    confirm(
      "Are you sure you want to delete this library card record? This action cannot be undone."
    )
  ) {
    const success = window.dataManager.deleteCard(cardId);
    if (success) {
      loadCards();
      window.notification.success("Library card record deleted successfully!");
    } else {
      window.notification.error(
        "Failed to delete library card record. Please try again."
      );
    }
  }
}

function searchCards() {
  const searchTerm = document.getElementById("cardSearch").value.toLowerCase();
  const allCards = window.dataManager.getCards();
  const visitors = window.dataManager.getVisitors();
  const books = window.dataManager.getBooks();

  if (!searchTerm) {
    displayCards(allCards);
    return;
  }

  const filteredCards = allCards.filter((card) => {
    const visitor = visitors.find((v) => v.id === card.visitorId);
    const book = books.find((b) => b.id === card.bookId);
    const status = card.returnDate ? "returned" : "borrowed";

    return (
      (visitor && visitor.name.toLowerCase().includes(searchTerm)) ||
      (book && book.name.toLowerCase().includes(searchTerm)) ||
      status.includes(searchTerm)
    );
  });

  displayCards(filteredCards);
}

function sortCards() {
  const sortBy = document.getElementById("cardSort").value;
  let cards = window.dataManager.getCards();
  const visitors = window.dataManager.getVisitors();
  const books = window.dataManager.getBooks();

  if (!sortBy) {
    cards.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
    displayCards(cards);
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
      const bookA = books.find((bk) => bk.id === a.bookId);
      const bookB = books.find((bk) => bk.id === b.bookId);
      return (bookA?.name || "").localeCompare(bookB?.name || "");
    } else if (sortBy === "status") {
      const statusA = a.returnDate ? "returned" : "borrowed";
      const statusB = b.returnDate ? "returned" : "borrowed";
      return statusA.localeCompare(statusB);
    }
    return 0;
  });

  displayCards(sortedCards);
}

window.returnBook = returnBook;
window.deleteCard = deleteCard;
