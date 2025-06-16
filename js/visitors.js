// Visitors page functionality
let editingVisitorId = null;

document.addEventListener("DOMContentLoaded", () => {
  loadVisitors();
  setupEventListeners();
});

function setupEventListeners() {
  const visitorModal = document.getElementById("visitorModal");
  const addVisitorBtn = document.getElementById("addVisitorBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const visitorForm = document.getElementById("visitorForm");

  // Open modal to ADD a new visitor
  addVisitorBtn.addEventListener("click", () => {
    resetVisitorFormForAdd();
    openVisitorModal();
  });

  // Close modal with buttons
  closeFormBtn.addEventListener("click", closeVisitorModal);
  cancelFormBtn.addEventListener("click", closeVisitorModal);

  // Close modal by clicking the overlay
  visitorModal.addEventListener("click", (e) => {
    if (e.target === visitorModal) {
      closeVisitorModal();
    }
  });

  // Close modal with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && visitorModal.classList.contains("show")) {
      closeVisitorModal();
    }
  });

  // Form submission
  visitorForm.addEventListener("submit", handleVisitorSubmit);

  // Search and sort
  document
    .getElementById("visitorSearch")
    .addEventListener("keyup", searchVisitors);
  document
    .getElementById("visitorSort")
    .addEventListener("change", sortVisitors);
}

function openVisitorModal() {
  const visitorModal = document.getElementById("visitorModal");
  visitorModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeVisitorModal() {
  const visitorModal = document.getElementById("visitorModal");
  visitorModal.classList.remove("show");
  document.body.classList.remove("modal-open");
}

function resetVisitorFormForAdd() {
  editingVisitorId = null;
  document.getElementById("visitorForm").reset();
  document.getElementById("visitorId").value = "";
  document.getElementById("visitorFormTitle").innerHTML =
    '<i class="fas fa-user-plus"></i> Add New Visitor';
}

function handleVisitorSubmit(e) {
  e.preventDefault();

  const visitorData = {
    name: document.getElementById("visitorName").value.trim(),
    phone: document.getElementById("visitorPhone").value.trim(),
  };

  if (!visitorData.name || !visitorData.phone) {
    window.notification.error("Name and Phone Number fields are required!");
    return;
  }

  const phoneRegex = /^[0-9\s-]+$/;
  if (!phoneRegex.test(visitorData.phone)) {
    window.notification.error(
      "Phone number must contain only numbers, spaces, and dashes!"
    );
    return;
  }

  const visitorIdValue = document.getElementById("visitorId").value;
  let result;

  if (visitorIdValue) {
    result = window.dataManager.updateVisitor(
      Number.parseInt(visitorIdValue),
      visitorData
    );
    if (result) {
      window.notification.success("Visitor updated successfully!");
    } else {
      window.notification.error(
        "Failed to update visitor. Visitor might not exist."
      );
      return;
    }
  } else {
    result = window.dataManager.addVisitor(visitorData);
    if (result) {
      window.notification.success("Visitor added successfully!");
    } else {
      window.notification.error("Failed to add visitor!");
      return;
    }
  }

  loadVisitors();
  closeVisitorModal();
}

function loadVisitors() {
  const visitors = window.dataManager.getVisitors();
  displayVisitors(visitors);
}

function displayVisitors(visitorList) {
  const container = document.getElementById("visitorsList");
  const countBadge = document.getElementById("visitorsCount");

  if (!container || !countBadge) {
    console.error("Visitors list container or count badge not found!");
    return;
  }

  countBadge.textContent = `${visitorList.length} visitor${
    visitorList.length === 1 ? "" : "s"
  }`;

  if (visitorList.length === 0) {
    container.innerHTML = `
      <div class="no-data">
        <i class="fas fa-users"></i>
        <h3>No visitors found</h3>
        <p>Register your first visitor to get started!</p>
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
        <td><span class="id-badge">${visitor.id}</span></td>
        <td><strong>${visitor.name}</strong></td>
        <td>${visitor.phone}</td>
        <td class="actions">
          <button onclick="editVisitor(${visitor.id})" class="btn btn-warning btn-sm">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteVisitor(${visitor.id})" class="btn btn-danger btn-sm">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table></div>";
  container.innerHTML = html;
}

function editVisitor(id) {
  const visitor = window.dataManager.getVisitorById(id);

  if (visitor) {
    document.getElementById("visitorId").value = visitor.id;
    document.getElementById("visitorName").value = visitor.name;
    document.getElementById("visitorPhone").value = visitor.phone;

    document.getElementById("visitorFormTitle").innerHTML =
      '<i class="fas fa-edit"></i> Edit Visitor';
    editingVisitorId = id;

    openVisitorModal();
  } else {
    window.notification.error("Visitor not found for editing.");
  }
}

function deleteVisitor(id) {
  if (
    confirm(
      "Are you sure you want to delete this visitor? This also removes their card history."
    )
  ) {
    const success = window.dataManager.deleteVisitor(id);

    if (success) {
      loadVisitors();
      window.notification.success("Visitor deleted successfully!");
    } else {
      window.notification.error("Failed to delete visitor. Please try again.");
    }
  }
}

function searchVisitors() {
  const searchTerm = document
    .getElementById("visitorSearch")
    .value.toLowerCase();
  const visitors = window.dataManager.getVisitors();

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm) ||
      visitor.phone.includes(searchTerm)
  );

  displayVisitors(filteredVisitors);
}

function sortVisitors() {
  const sortBy = document.getElementById("visitorSort").value;
  if (!sortBy) {
    loadVisitors();
    return;
  }

  const visitors = window.dataManager.getVisitors();
  const sortedVisitors = [...visitors].sort((a, b) => {
    if (sortBy === "id") {
      return a.id - b.id;
    }
    if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
      return a[sortBy].localeCompare(b[sortBy]);
    }
    if (a[sortBy] < b[sortBy]) return -1;
    if (a[sortBy] > b[sortBy]) return 1;
    return 0;
  });

  displayVisitors(sortedVisitors);
}

window.editVisitor = editVisitor;
window.deleteVisitor = deleteVisitor;
