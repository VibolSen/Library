// Statistics page functionality
document.addEventListener("DOMContentLoaded", () => {
  loadStatistics();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("refreshStatsBtn").addEventListener("click", () => {
    refreshStatistics();
  });
}

function refreshStatistics() {
  loadStatistics();
  window.notification.success("Statistics refreshed!");
}

function loadStatistics() {
  loadOverviewStats();
  loadPopularBooks();
  loadActiveVisitors();
  loadMonthlyActivity();
  loadReturnRate();
}

function loadOverviewStats() {
  const stats = window.dataManager.getStatistics();

  document.getElementById("statsBooks").textContent = stats.totalBooks;
  document.getElementById("statsVisitors").textContent = stats.totalVisitors;
  document.getElementById("statsTransactions").textContent =
    stats.totalTransactions;
  document.getElementById("statsActive").textContent = stats.borrowedBooks;
}

function loadPopularBooks() {
  const popularBooks = window.dataManager.getPopularBooks();
  const container = document.getElementById("popularBooks");

  if (popularBooks.length === 0) {
    container.innerHTML = `
              <div class="no-data">
                  <i class="fas fa-chart-bar"></i>
                  <p>No borrowing data available</p>
              </div>
          `;
    return;
  }

  const cards = window.dataManager.getCards();
  const totalBorrows = cards.length;
  let html = "";

  popularBooks.forEach((item, index) => {
    const percentage =
      totalBorrows > 0 ? Math.round((item.count / totalBorrows) * 100) : 0;
    html += `
              <div class="ranking-item">
                  <div class="rank-number">${index + 1}</div>
                  <div class="rank-content">
                      <div class="rank-info">
                          <h4>${item.book.name}</h4>
                          <p>by ${item.book.author}</p>
                      </div>
                      <div class="rank-stats">
                          <span class="count">${item.count} times</span>
                          <div class="progress-bar">
                              <div class="progress-fill" style="width: ${percentage}%"></div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  });

  container.innerHTML = html;
}

function loadActiveVisitors() {
  const activeVisitors = window.dataManager.getActiveVisitors();
  const container = document.getElementById("activeVisitors");

  if (activeVisitors.length === 0) {
    container.innerHTML = `
              <div class="no-data">
                  <i class="fas fa-chart-bar"></i>
                  <p>No borrowing data available</p>
              </div>
          `;
    return;
  }

  const cards = window.dataManager.getCards();
  const totalBorrows = cards.length;
  let html = "";

  activeVisitors.forEach((item, index) => {
    const percentage =
      totalBorrows > 0 ? Math.round((item.count / totalBorrows) * 100) : 0;
    html += `
              <div class="ranking-item">
                  <div class="rank-number">${index + 1}</div>
                  <div class="rank-content">
                      <div class="rank-info">
                          <h4>${item.visitor.name}</h4>
                          <p>${item.visitor.phone}</p>
                      </div>
                      <div class="rank-stats">
                          <span class="count">${item.count} books</span>
                          <div class="progress-bar">
                              <div class="progress-fill" style="width: ${percentage}%"></div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  });

  container.innerHTML = html;
}

function loadMonthlyActivity() {
  const cards = window.dataManager.getCards();
  const container = document.getElementById("monthlyActivity");

  if (cards.length === 0) {
    container.innerHTML = `
              <div class="no-data">
                  <i class="fas fa-calendar-alt"></i>
                  <p>No activity data available</p>
              </div>
          `;
    return;
  }

  // Group by month
  const monthlyData = {};
  cards.forEach((card) => {
    const month = card.borrowDate.substring(0, 7); // YYYY-MM
    if (monthlyData[month]) {
      monthlyData[month]++;
    } else {
      monthlyData[month] = 1;
    }
  });

  // Get last 6 months
  const sortedMonths = Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6);

  if (sortedMonths.length === 0) {
    container.innerHTML = `
              <div class="no-data">
                  <i class="fas fa-calendar-alt"></i>
                  <p>No monthly data available</p>
              </div>
          `;
    return;
  }

  const maxCount = Math.max(...Object.values(monthlyData));
  let html = "";

  sortedMonths.forEach(([month, count]) => {
    const monthName = new Date(month + "-01").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

    html += `
              <div class="activity-item">
                  <div class="activity-month">${monthName}</div>
                  <div class="activity-bar">
                      <div class="activity-fill" style="width: ${percentage}%"></div>
                  </div>
                  <div class="activity-count">${count}</div>
              </div>
          `;
  });

  container.innerHTML = html;
}

function loadReturnRate() {
  const cards = window.dataManager.getCards();
  const container = document.getElementById("returnRate");

  if (cards.length === 0) {
    container.innerHTML = `
              <div class="no-data">
                  <i class="fas fa-percentage"></i>
                  <p>No return data available</p>
              </div>
          `;
    return;
  }

  const stats = window.dataManager.getStatistics();
  const returnRate =
    stats.totalTransactions > 0
      ? Math.round((stats.returnedBooks / stats.totalTransactions) * 100)
      : 0;

  container.innerHTML = `
          <div class="return-stats-content">
              <div class="return-circle">
                  <div class="return-percentage">${returnRate}%</div>
                  <div class="return-label">Return Rate</div>
              </div>
              <div class="return-details">
                  <div class="return-item">
                      <span class="return-count">${stats.returnedBooks}</span>
                      <span class="return-text">Books Returned</span>
                  </div>
                  <div class="return-item">
                      <span class="return-count">${stats.borrowedBooks}</span>
                      <span class="return-text">Still Borrowed</span>
                  </div>
                  <div class="return-item">
                      <span class="return-count">${stats.totalTransactions}</span>
                      <span class="return-text">Total Transactions</span>
                  </div>
              </div>
          </div>
      `;
}
