const locationInput = document.getElementById("locationFilterInput");
const locationOptions = document.getElementById("locationOptions");
const selectedBox = document.getElementById("selectedLocations");

// 🕒 Date Posted (single-select checkbox)
const dateCheckboxes = document.querySelectorAll(".date-filter");
const params = new URLSearchParams(window.location.search);
const activeDate = params.get("postedWithin");

// ⭐ Ratings (single-select checkbox)
const ratingCheckboxes = document.querySelectorAll(".rating-filter");
const activeRating = new URLSearchParams(window.location.search).get("rating");

// 📏 Distance filter (single-select checkbox)
const distanceCheckboxes = document.querySelectorAll(".distance-filter");
// const activeRadius = params.get("radius");
const activeRadius = new URLSearchParams(window.location.search).get("radius");

// price filter
const priceMinInput = document.getElementById("priceMin");
const priceMaxInput = document.getElementById("priceMax");
const addPriceBtn = document.getElementById("addPriceRange");
const applyPriceBtn = document.getElementById("applyPriceFilter");
const priceBox = document.getElementById("selectedPrices");

// restore checked state
distanceCheckboxes.forEach(cb => {
  cb.checked = cb.value === activeRadius;
});

distanceCheckboxes.forEach(cb => {
  cb.addEventListener("change", async () => {
    const params = new URLSearchParams(window.location.search);

    if (cb.checked) {
      distanceCheckboxes.forEach(o => o !== cb && (o.checked = false));

      try {
        const coords = await window.ensureLocation();

        params.set("lat", coords.lat);
        params.set("lng", coords.lng);
        params.set("radius", cb.value);

        window.location.search = params.toString();
      } catch {
        cb.checked = false;
      }
    } else {
      params.delete("lat");
      params.delete("lng");
      params.delete("radius");
      window.location.search = params.toString();
    }
  });
});



// restore state
dateCheckboxes.forEach(cb => {
  cb.checked = cb.value === activeDate;
});

dateCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const params = new URLSearchParams(window.location.search);

    if (cb.checked) {
      // uncheck others
      dateCheckboxes.forEach(other => {
        if (other !== cb) other.checked = false;
      });
      params.set("postedWithin", cb.value);
    } else {
      params.delete("postedWithin");
    }

    window.location.search = params.toString();
  });
});

// restore state
ratingCheckboxes.forEach(cb => {
  cb.checked = cb.value === activeRating;
});

ratingCheckboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const params = new URLSearchParams(window.location.search);

    if (cb.checked) {
      ratingCheckboxes.forEach(other => {
        if (other !== cb) other.checked = false;
      });
      params.set("rating", cb.value);
    } else {
      params.delete("rating");
    }

    window.location.search = params.toString();
  });
});



// ✅ Initialize selectedLocations from URL params
let selectedLocations = [];

const urlBBoxes = new URLSearchParams(window.location.search).get("bbox");
if (urlBBoxes) {
  const bboxes = urlBBoxes.split("|");
  const labels = new URLSearchParams(window.location.search).get("labels");
  
  if (labels) {
    const labelArray = labels.split("|");
    selectedLocations = bboxes.map((bbox, i) => ({
      bbox,
      label: decodeURIComponent(labelArray[i] || "Location")
    }));
  } else {
    // Fallback: extract from localStorage
    selectedLocations = bboxes.map(bbox => ({
      bbox,
      label: localStorage.getItem(`bbox_${bbox}`) || "Location"
    }));
  }
}

let activeIndex = -1;

//fetch and render locations sugestions

locationInput.addEventListener("focus", () => {
  fetchLocations();
  locationOptions.style.display = "block";
});

locationInput.addEventListener("input", () => {
  fetchLocations(locationInput.value.trim());
});

document.addEventListener("click", (e) => {
  if (!locationInput.contains(e.target) && !locationOptions.contains(e.target)) {
    locationOptions.style.display = "none";
  }
});

async function fetchLocations(query = "") {
  const res = await fetch(`/api/filters/locations?q=${query}`);
  const locations = await res.json();
  renderLocations(locations);
}

function renderLocations(locations) {
  activeIndex = -1;

  if (!locations.length) {
    locationOptions.innerHTML = "";
    return;
  }

  locationOptions.innerHTML = locations.map((loc, i) => `
    <div class="location-item"
         data-index="${i}"
         data-bbox="${loc.bbox.join(",")}"
         data-label="${loc.label}">
      ${loc.label}
    </div>
  `).join("");
}

// select location (click + keyboard)

locationOptions.addEventListener("click", (e) => {
  const item = e.target.closest(".location-item");
  if (!item) return;

  addBBox(item.dataset.bbox, item.dataset.label);
  locationOptions.style.display = "none";
});

locationInput.addEventListener("keydown", (e) => {
  const items = document.querySelectorAll(".location-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  }

  if (e.key === "Enter" && activeIndex >= 0) {
    e.preventDefault();
    addBBox(items[activeIndex].dataset.bbox, items[activeIndex].dataset.label);
    locationOptions.style.display = "none";
  }

  items.forEach(el => el.classList.remove("active"));
  if (items[activeIndex]) items[activeIndex].classList.add("active");
});

// bbox state managements

function addBBox(bbox, label) {
  if (selectedLocations.some(l => l.bbox === bbox)) return;

  selectedLocations.push({ bbox, label });
  
  // ✅ Store label for later retrieval
  localStorage.setItem(`bbox_${bbox}`, label);
  
  updateBBoxURL();
}

function removeBBox(bbox) {
  selectedLocations = selectedLocations.filter(l => l.bbox !== bbox);
  
  // ✅ Clean up localStorage
  localStorage.removeItem(`bbox_${bbox}`);
  
  updateBBoxURL();
}

function updateBBoxURL() {
  const params = new URLSearchParams(window.location.search);

  if (selectedLocations.length) {
    params.set(
      "bbox",
      selectedLocations.map(l => l.bbox).join("|")
    );
    
    // ✅ Store labels in URL too
    params.set(
      "labels",
      selectedLocations.map(l => encodeURIComponent(l.label)).join("|")
    );
  } else {
    params.delete("bbox");
    params.delete("labels");
  }

  window.location.search = params.toString();
}

// pills type UI, multilocation add 

function renderSelected() {
  if (!selectedLocations.length) {
    selectedBox.innerHTML = "";
    return;
  }

  selectedBox.innerHTML = selectedLocations.map(loc => `
    <span class="badge">
      ${loc.label}
      <span class="remove-pill" data-bbox="${loc.bbox}" style="cursor:pointer;">✕</span>
    </span>
  `).join("");
}

selectedBox.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-pill")) return;

  const bbox = e.target.dataset.bbox;
  removeBBox(bbox);
});

// Initial render
renderSelected();

// state
let selectedPrices = [];

// restore from URL
const priceParam = new URLSearchParams(window.location.search).get("price");
if (priceParam) {
  selectedPrices = priceParam.split("|").map(r => {
    const [min, max] = r.split("-");
    return { min, max };
  });
}

async function renderPrices() {
  const profile = await window.getGlobalCurrency?.() || { symbol: "₹" };

  if (!selectedPrices.length) {
    priceBox.innerHTML = "";
    return;
  }

  priceBox.innerHTML = selectedPrices.map(p => `
    <span class="badge">
      ${profile.symbol}${p.min} – ${profile.symbol}${p.max}
      <span class="remove-pill" data-range="${p.min}-${p.max}">✕</span>
    </span>
  `).join("");
}


function tryAddPriceOnEnter(e) {
  if (e.key !== "Enter") return;

  const min = priceMinInput.value;
  const max = priceMaxInput.value;

  if (!min || !max || Number(min) > Number(max)) return;

  // reuse existing button logic
  addPriceBtn.click();
}

addPriceBtn.addEventListener("click", () => {
  const min = priceMinInput.value;
  const max = priceMaxInput.value;

  if (!min || !max || Number(min) > Number(max)) return;

  const exists = selectedPrices.some(
    p => p.min === min && p.max === max
  );
  if (exists) return;

  selectedPrices.push({ min, max });

  priceMinInput.value = "";
  priceMaxInput.value = "";

  renderPrices();
});

priceBox.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-pill")) return;

  const [min, max] = e.target.dataset.range.split("-");
  selectedPrices = selectedPrices.filter(
    p => !(p.min === min && p.max === max)
  );

  const params = new URLSearchParams(window.location.search);

  if (selectedPrices.length) {
    params.set(
      "price",
      selectedPrices.map(p => `${p.min}-${p.max}`).join("|")
    );
  } else {
    params.delete("price");
  }

  window.location.search = params.toString(); // 🔥 instant apply
});


applyPriceBtn.addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);

  if (selectedPrices.length) {
    params.set(
      "price",
      selectedPrices.map(p => `${p.min}-${p.max}`).join("|")
    );
  } else {
    params.delete("price");
  }

  window.location.search = params.toString();
});

priceMinInput.addEventListener("keydown", tryAddPriceOnEnter);
priceMaxInput.addEventListener("keydown", tryAddPriceOnEnter);

// initial render
renderPrices();