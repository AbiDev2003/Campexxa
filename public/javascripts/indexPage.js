// FILTER TOGGLE
const filterBtn = document.getElementById("filterToggle");
const filtersPanel = document.getElementById("filtersPanel");

if (filterBtn && filtersPanel) {
  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filtersPanel.classList.toggle("show");
  });

  filtersPanel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  window.addEventListener("click", () => {
    if (filtersPanel.classList.contains("show")) {
      filtersPanel.classList.remove("show");
    }
  });
}

// LOAD MAPBOX + CLUSTER MAP
window.addEventListener("load", () => {
  setTimeout(() => {
    const mapScript = document.createElement("script");
    mapScript.src =
      "https://api.mapbox.com/mapbox-gl-js/v3.17.0-beta.1/mapbox-gl.js";

    mapScript.onload = () => {
      const clusterScript = document.createElement("script");
      clusterScript.src = "/javascripts/clusterMap.js";
      document.body.appendChild(clusterScript);
    };

    document.body.appendChild(mapScript);
  }, 1500);
});