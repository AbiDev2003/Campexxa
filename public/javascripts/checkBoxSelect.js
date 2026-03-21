document.addEventListener("DOMContentLoaded", () => {
  
  // Find every select-all checkbox on the page
  const selectAllBoxes = document.querySelectorAll("[data-selectall]");

  selectAllBoxes.forEach(selectAll => {
    const targetClass = selectAll.getAttribute("data-selectall");

    // All delete checkboxes that belong to this select-all
    const checkboxes = document.querySelectorAll(`.${targetClass}`);

    if (!checkboxes.length) return;

    // Select / Unselect all
    selectAll.addEventListener("change", function () {
      checkboxes.forEach(cb => (cb.checked = this.checked));
    });
  });

});
