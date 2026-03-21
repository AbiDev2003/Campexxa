document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("campground-sort");

  // restore selected sort from URL
  const params = new URLSearchParams(window.location.search);
  const activeSort = params.get("sort");
  if (activeSort) sortSelect.value = activeSort;

  sortSelect.addEventListener("change", () => {
    const params = new URLSearchParams(window.location.search);
    const value = sortSelect.value;

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    window.location.search = params.toString();
  });
});
