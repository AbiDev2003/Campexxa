document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loadMoreBtn");

  // support both layouts
  const container =
    document.getElementById("campGrid") ||
    document.getElementById("reviewsContainer") ||
    document.querySelector(".row");

  if (!btn || !container) return;

  let page = Number(document.body.dataset.page);
  let hasMore = document.body.dataset.hasmore === "true";
  let tab = document.body.dataset.tab || "";

  let loading = false;

  btn.addEventListener("click", async () => {
    if (loading || !hasMore) return;

    loading = true;
    btn.textContent = "Loading...";
    page++;

    const url = new URL(window.location.href);
    url.searchParams.set("page", page);

    if (tab) {
      url.searchParams.set("tab", tab);
    }

    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const data = await res.json();

      container.insertAdjacentHTML("beforeend", data.html);

      hasMore = data.hasMore;
      loading = false;

      if (!hasMore) {
        btn.remove();
      } else {
        btn.textContent = "Load More";
      }
    } catch (err) {
      console.error("Load more error:", err);
      loading = false;
      btn.textContent = "Load More";
    }
  });
});