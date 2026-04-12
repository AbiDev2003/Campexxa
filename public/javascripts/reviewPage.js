document.addEventListener("DOMContentLoaded", () => {

  // SORT
  const sortSelect = document.getElementById("reviewSort");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", this.value);
      url.searchParams.set("page", 1);
      window.location.href = url.toString();
    });
  }

  // PER PAGE
  const limitSelect = document.getElementById("reviewsPerPage");
  if (limitSelect) {
    limitSelect.addEventListener("change", function () {
      const url = new URL(window.location.href);
      url.searchParams.set("limit", this.value);
      url.searchParams.set("page", 1);
      window.location.href = url.toString();
    });
  }

});