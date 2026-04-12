document.addEventListener('DOMContentLoaded', () => {

  const selectAll = document.getElementById("selectAllCheckbox");
  const checkboxes = document.querySelectorAll(".card-checkbox");
  const bulkBtn = document.getElementById("bulkActionBtn");

  if (!bulkBtn) return; // safety

  function updateButtonState() {
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    bulkBtn.disabled = !anyChecked;
  }

  function syncSelectAll() {
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (selectAll) selectAll.checked = allChecked;
  }

  // individual checkbox
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      updateButtonState();
      syncSelectAll();
    });
  });

  // select all
  if (selectAll) {
    selectAll.addEventListener("change", function () {
      checkboxes.forEach(cb => cb.checked = this.checked);
      updateButtonState();
    });
  }

});