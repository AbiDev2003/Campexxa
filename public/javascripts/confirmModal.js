document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmModal");
  const confirmForm = document.getElementById("confirmForm");

  if (!modal || !confirmForm) return;

  modal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;

    if (!button) return;

    const action = button.getAttribute("data-action");

    if (action) {
      confirmForm.setAttribute("action", action);
    }
  });
});