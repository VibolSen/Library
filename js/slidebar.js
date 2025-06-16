// sidebar.js - Handles sidebar functionality
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const mainContent = document.getElementById("mainContent");

  // Toggle sidebar on mobile
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    sidebarOverlay.classList.toggle("show");
    document.body.classList.toggle("sidebar-open");

    // Add ripple effect to toggle button
    addRippleEffect(sidebarToggle);
  });

  // Close sidebar on mobile
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
    document.body.classList.remove("sidebar-open");
  });

  // Close sidebar when clicking overlay
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    sidebarOverlay.classList.remove("show");
    document.body.classList.remove("sidebar-open");
  });

  // Add active class to current nav link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    // Add ripple effect to nav links
    link.addEventListener("click", function (e) {
      addRippleEffect(this);
    });

    // Set active link based on current page
    const linkPath = link.getAttribute("href");
    if (
      currentPath.includes(linkPath) ||
      (currentPath === "/" && linkPath === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // Add ripple effect function
  function addRippleEffect(element) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Add CSS for ripple effect
  const style = document.createElement("style");
  style.textContent = `
    .nav-link, .sidebar-toggle {
      position: relative;
      overflow: hidden;
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});
