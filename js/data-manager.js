// Data Manager - Handles all localStorage operations and data management
class DataManager {
  constructor() {
    this.storageKeys = {
      books: "library_books",
      visitors: "library_visitors",
      cards: "library_cards",
      bookIdCounter: "book_id_counter",
      visitorIdCounter: "visitor_id_counter",
      cardIdCounter: "card_id_counter",
    };
    // Initialize data if not present
    if (!localStorage.getItem(this.storageKeys.books))
      this.setData(this.storageKeys.books, []);
    if (!localStorage.getItem(this.storageKeys.bookIdCounter))
      this.setCounter(this.storageKeys.bookIdCounter, 1);
    if (!localStorage.getItem(this.storageKeys.visitors))
      this.setData(this.storageKeys.visitors, []);
    if (!localStorage.getItem(this.storageKeys.visitorIdCounter))
      this.setCounter(this.storageKeys.visitorIdCounter, 1);
    if (!localStorage.getItem(this.storageKeys.cards))
      this.setData(this.storageKeys.cards, []);
    if (!localStorage.getItem(this.storageKeys.cardIdCounter))
      this.setCounter(this.storageKeys.cardIdCounter, 1);
  }

  // Generic data operations
  getData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting data for ${key}:`, error);
      return [];
    }
  }

  setData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error setting data for ${key}:`, error);
      return false;
    }
  }

  getCounter(key) {
    try {
      const counterValue = localStorage.getItem(key);
      return counterValue !== null && !isNaN(Number.parseInt(counterValue))
        ? Number.parseInt(counterValue)
        : 1;
    } catch (error) {
      console.error(`Error getting counter for ${key}:`, error);
      return 1;
    }
  }

  setCounter(key, value) {
    try {
      localStorage.setItem(key, value.toString());
      return true;
    } catch (error) {
      console.error(`Error setting counter for ${key}:`, error);
      return false;
    }
  }

  // Books operations
  getBooks() {
    return this.getData(this.storageKeys.books);
  }

  saveBooks(books) {
    return this.setData(this.storageKeys.books, books);
  }

  addBook(bookData) {
    const books = this.getBooks();
    const counter = this.getCounter(this.storageKeys.bookIdCounter);
    const newBook = { ...bookData, id: counter };
    books.push(newBook);
    if (
      this.saveBooks(books) &&
      this.setCounter(this.storageKeys.bookIdCounter, counter + 1)
    ) {
      return newBook;
    }
    return null;
  }

  updateBook(id, bookData) {
    const books = this.getBooks();
    const bookId = Number(id);
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books[index] = { ...books[index], ...bookData, id: bookId }; // Preserve other fields, ensure ID is correct
      if (this.saveBooks(books)) {
        return books[index];
      }
    }
    return null;
  }

  deleteBook(id) {
    let books = this.getBooks();
    const bookId = Number(id);
    const initialLength = books.length;
    books = books.filter((book) => book.id !== bookId);
    if (books.length < initialLength) {
      return this.saveBooks(books);
    }
    return false;
  }

  getBookById(id) {
    const books = this.getBooks();
    const bookId = Number(id);
    return books.find((book) => book.id === bookId);
  }

  // Visitors operations
  getVisitors() {
    return this.getData(this.storageKeys.visitors);
  }

  saveVisitors(visitors) {
    return this.setData(this.storageKeys.visitors, visitors);
  }

  addVisitor(visitorData) {
    const visitors = this.getVisitors();
    const counter = this.getCounter(this.storageKeys.visitorIdCounter);
    const newVisitor = { ...visitorData, id: counter };
    visitors.push(newVisitor);
    if (
      this.saveVisitors(visitors) &&
      this.setCounter(this.storageKeys.visitorIdCounter, counter + 1)
    ) {
      return newVisitor;
    }
    return null;
  }

  updateVisitor(id, visitorData) {
    const visitors = this.getVisitors();
    const visitorId = Number(id);
    const index = visitors.findIndex((visitor) => visitor.id === visitorId);
    if (index !== -1) {
      visitors[index] = { ...visitors[index], ...visitorData, id: visitorId };
      if (this.saveVisitors(visitors)) {
        return visitors[index];
      }
    }
    return null;
  }

  getVisitorById(id) {
    const visitors = this.getVisitors();
    const visitorId = Number(id);
    return visitors.find((visitor) => visitor.id === visitorId);
  }

  deleteVisitor(id) {
    let visitors = this.getVisitors();
    const visitorId = Number(id);
    if (isNaN(visitorId)) return false;
    const initialLength = visitors.length;
    visitors = visitors.filter((visitor) => visitor.id !== visitorId);
    if (visitors.length < initialLength) {
      return this.saveVisitors(visitors);
    }
    return false;
  }

  // Cards operations
  getCards() {
    return this.getData(this.storageKeys.cards);
  }

  saveCards(cards) {
    return this.setData(this.storageKeys.cards, cards);
  }

  addCard(cardData) {
    const cards = this.getCards();
    const counter = this.getCounter(this.storageKeys.cardIdCounter);
    const newCard = {
      ...cardData,
      id: counter,
      borrowDate: this.getCurrentDate(),
      returnDate: null,
    };
    cards.push(newCard);
    if (
      this.saveCards(cards) &&
      this.setCounter(this.storageKeys.cardIdCounter, counter + 1)
    ) {
      return newCard;
    }
    return null;
  }

  returnBook(cardIdInput) {
    const cards = this.getCards();
    const cardId = Number(cardIdInput);
    const cardIndex = cards.findIndex((c) => c.id === cardId);

    if (cardIndex !== -1 && !cards[cardIndex].returnDate) {
      cards[cardIndex].returnDate = this.getCurrentDate();

      const books = this.getBooks();
      const bookToUpdate = books.find(
        (b) => b.id === Number(cards[cardIndex].bookId)
      );
      if (bookToUpdate) {
        bookToUpdate.copies = (bookToUpdate.copies || 0) + 1;
        this.saveBooks(books); // Save updated books array
      }

      if (this.saveCards(cards)) {
        // Save updated cards array
        return cards[cardIndex];
      }
    }
    return null;
  }

  // NEW FUNCTION TO DELETE A CARD
  deleteCard(cardIdInput) {
    console.log(`[DataManager] deleteCard called for ID: ${cardIdInput}`);
    let cards = this.getCards();
    const cardId = Number(cardIdInput);

    if (isNaN(cardId)) {
      console.error(
        `[DataManager] Invalid Card ID type for deletion: ${cardIdInput}`
      );
      return false;
    }

    const cardIndex = cards.findIndex((card) => card.id === cardId);

    if (cardIndex === -1) {
      console.warn(
        `[DataManager] Card with ID ${cardId} not found. No deletion performed.`
      );
      return false; // Card not found
    }

    const cardToDelete = cards[cardIndex];

    // Logic to increment book copy if the book was borrowed and not yet returned
    if (!cardToDelete.returnDate) {
      console.log(
        `[DataManager] Card ${cardId} is for a borrowed book. Incrementing book copy.`
      );
      const books = this.getBooks();
      const bookToUpdate = books.find(
        (b) => b.id === Number(cardToDelete.bookId)
      );
      if (bookToUpdate) {
        bookToUpdate.copies = (bookToUpdate.copies || 0) + 1;
        if (!this.saveBooks(books)) {
          console.error(
            `[DataManager] Failed to update book copies while deleting card ${cardId}.`
          );
          // Decide if you want to stop deletion or proceed. For now, proceed.
        } else {
          console.log(
            `[DataManager] Book ID ${bookToUpdate.id} copies incremented.`
          );
        }
      } else {
        console.warn(
          `[DataManager] Book (ID: ${cardToDelete.bookId}) associated with card ${cardId} not found. Cannot update copies.`
        );
      }
    }

    // Remove the card
    cards.splice(cardIndex, 1);

    if (this.saveCards(cards)) {
      console.log(`[DataManager] Card ${cardId} deleted and data saved.`);
      return true;
    } else {
      console.error(
        `[DataManager] Failed to save cards after deleting card ${cardId}.`
      );
      return false; // Failed to save the updated cards array
    }
  }

  // Utility methods
  getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  formatDate(dateString) {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Error Date";
    }
  }

  // Statistics methods (ensure IDs are numbers for lookups)
  getStatistics() {
    const books = this.getBooks();
    const visitors = this.getVisitors();
    const cards = this.getCards();
    return {
      totalBooks: books.length,
      totalVisitors: visitors.length,
      totalTransactions: cards.length,
      borrowedBooks: cards.filter((card) => !card.returnDate).length,
      availableBooks: books.reduce((sum, book) => sum + (book.copies || 0), 0),
      returnedBooks: cards.filter((card) => card.returnDate).length,
    };
  }

  getPopularBooks(limit = 5) {
    const cards = this.getCards();
    const books = this.getBooks();
    const bookStats = {};
    cards.forEach((card) => {
      const bookIdNum = Number(card.bookId);
      bookStats[bookIdNum] = (bookStats[bookIdNum] || 0) + 1;
    });
    return Object.entries(bookStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([bookId, count]) => {
        const book = books.find((b) => b.id === Number(bookId));
        return { book, count };
      })
      .filter((item) => item.book);
  }

  getActiveVisitors(limit = 5) {
    const cards = this.getCards();
    const visitors = this.getVisitors();
    const visitorStats = {};
    cards.forEach((card) => {
      const visitorIdNum = Number(card.visitorId);
      visitorStats[visitorIdNum] = (visitorStats[visitorIdNum] || 0) + 1;
    });
    return Object.entries(visitorStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([visitorId, count]) => {
        const visitor = visitors.find((v) => v.id === Number(visitorId));
        return { visitor, count };
      })
      .filter((item) => item.visitor);
  }

  getRecentActivity(limit = 5) {
    const cards = this.getCards();
    const books = this.getBooks();
    const visitors = this.getVisitors();
    const sortedCards = [...cards].sort((a, b) => b.id - a.id); // Assuming higher ID is newer

    return sortedCards.slice(0, limit).map((card) => {
      const book = books.find((b) => b.id === Number(card.bookId));
      const visitor = visitors.find((v) => v.id === Number(card.visitorId));

      // This returns the full book and visitor objects, which dashboard.js expects
      return {
        ...card,
        book: book,
        visitor: visitor,
        status: card.returnDate ? "returned" : "borrowed",
      };
    });
  }
}

if (!window.dataManager) {
  window.dataManager = new DataManager();
}
