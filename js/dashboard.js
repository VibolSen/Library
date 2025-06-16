// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  updateDashboardStats();
  loadRecentActivity();

  // Animate stats on load
  animateStats();
});

function animateStats() {
  const statCards = document.querySelectorAll(".stat-card");

  statCards.forEach((card, index) => {
    // Add staggered animation
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;

    // Add progress animation
    const progressFill = card.querySelector(".progress-fill");
    if (progressFill) {
      setTimeout(() => {
        const randomProgress = Math.min(
          Math.floor(Math.random() * 100) + 20,
          100
        );
        progressFill.style.width = `${randomProgress}%`;
      }, 500 + index * 100);
    }
  });
}

function updateDashboardStats() {
  const stats = window.dataManager.getStatistics();

  // Animate numbers counting up
  animateValue("totalBooks", 0, stats.totalBooks, 1500);
  animateValue("totalVisitors", 0, stats.totalVisitors, 1500);
  animateValue("borrowedBooks", 0, stats.borrowedBooks, 1500);
  animateValue("availableBooks", 0, stats.availableBooks, 1500);
}

function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    obj.innerHTML = value.toLocaleString();

    // Add "+" if value is increasing
    if (progress < 1 && value < end) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function loadRecentActivity() {
  const recentActivity = window.dataManager.getRecentActivity();
  const container = document.getElementById("recentActivity");

  // Remove loading placeholder
  container.innerHTML = "";

  if (recentActivity.length === 0) {
    container.innerHTML = `
      <div class="no-activity">
        <i class="fas fa-book-open"></i>
        <p>No recent activity found</p>
      </div>
    `;
    return;
  }

  // Limit to 5 most recent activities
  const limitedActivity = recentActivity.slice(0, 5);

  let html = "";
  limitedActivity.forEach((activity) => {
    const icon = activity.status === "returned" ? "fa-undo" : "fa-hand-holding";
    const statusClass =
      activity.status === "returned" ? "returned" : "borrowed";
    const date = activity.returnDate || activity.borrowDate;
    const formattedDate = window.dataManager.formatDate(date);

    // Friendly status text
    const statusText =
      activity.status === "returned"
        ? "returned the book"
        : "borrowed the book";

    html += `
      <div class="activity-item">
        <div class="activity-icon ${statusClass}">
          <i class="fas ${icon}"></i>
        </div>
        <div class="activity-content">
          <p>
            <span class="member-name">${
              activity.visitor?.name || "Unknown Member"
            }</span>
            ${statusText}
            <span class="book-title">"${
              activity.book?.name || "Unknown Book"
            }"</span>
          </p>
          <span class="activity-date">
            <i class="far fa-clock"></i> ${formattedDate}
          </span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Add animation to activity items
  const activityItems = container.querySelectorAll(".activity-item");
  activityItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-20px)";
    item.style.animation = `fadeInRight 0.4s ease forwards ${
      index * 0.1 + 0.5
    }s`;
  });
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);
