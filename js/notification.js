// Notification System
class NotificationManager {
  constructor() {
    this.notifications = [];
  }

  show(message, type = "info", duration = 3000) {
    const notification = this.create(message, type);
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100);

    // Hide notification after duration
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  }

  create(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    const icon = this.getIcon(type);
    notification.innerHTML = `
              <i class="fas ${icon}"></i>
              <span>${message}</span>
          `;

    return notification;
  }

  getIcon(type) {
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };
    return icons[type] || icons.info;
  }

  success(message, duration) {
    this.show(message, "success", duration);
  }

  error(message, duration) {
    this.show(message, "error", duration);
  }

  warning(message, duration) {
    this.show(message, "warning", duration);
  }

  info(message, duration) {
    this.show(message, "info", duration);
  }
}

// Create global instance
window.notification = new NotificationManager();
