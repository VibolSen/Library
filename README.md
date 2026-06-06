# STEPLibrary - Library Management System

STEPLibrary is a modern, responsive, and interactive frontend web application designed to manage library operations. It runs entirely in the browser and uses `localStorage` for persistent data management, making it lightweight and easy to run without any backend setup.

---

## 🚀 Features

- **Dashboard**: Real-time summary statistics (total books, registered visitors, books currently borrowed, available books), recent activity feeds, and quick access actions.
- **Books Management**: Browse, search, add, edit, and delete books in the catalog.
- **Visitors Management**: Register new visitors and maintain visitor profiles.
- **Library Cards & Lending**: Issue library cards and manage book lending transactions (borrowing and returning books).
- **Statistics & Reports**: Visualized statistical breakdowns of library usage and borrowing behavior.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic markup for layout and structure.
- **CSS3 (Vanilla)**: Premium styling featuring responsive layouts, custom fonts, sleek dashboards, and smooth animations.
- **JavaScript (Vanilla)**: Client-side logic, routing, and component interaction.
- **Web Storage API (`localStorage`)**: Used to persist library datasets across page reloads.
- **Font Awesome**: Modern vector icons for a highly interactive design.
- **Google Fonts (Poppins)**: Sleek, premium typography.

---

## 📁 Project Structure

```text
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── books.js            # Book page management logic
│   ├── cards.js            # Card & lending management logic
│   ├── dashboard.js        # Dashboard statistics & activity logic
│   ├── data-manager.js     # Shared data manager utilizing localStorage
│   ├── notification.js     # Toast and popup notifications helper
│   ├── script.js           # Shared navigation & general utilities
│   ├── slidebar.js         # Sidebar dynamic responsive controls
│   ├── statistics.js       # Reports & statistics visualizations
│   └── visitors.js         # Visitors registration logic
├── page/
│   ├── books.html          # Books catalog view
│   ├── cards.html          # Library card & lending view
│   ├── statistics.html    # Analytics view
│   └── visitors.html       # Visitors registry view
├── .gitignore              # Files and directories ignored by Git
├── index.html              # Landing page (Dashboard)
└── README.md               # Project documentation
```

---

## 🏁 Getting Started

### Prerequisites
You only need a modern web browser (Google Chrome, Firefox, Safari, Microsoft Edge, etc.).

### Running the Project
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Library
   ```
3. Open `index.html` directly in your browser of choice.
   - Alternatively, for the best experience (live reloading, server environment), open the folder in **VS Code** and run it using the **Live Server** extension.

---

## 📝 License
This project is for educational purposes. Feel free to use and adapt it for your own requirements.
