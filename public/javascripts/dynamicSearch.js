let timer;
const input = document.getElementById("globalSearchInput");
const suggestionsBox = document.getElementById("searchSuggestions");
const form = document.getElementById("global-search-form");

input.addEventListener("input", () => {
    clearTimeout(timer);
    const query = input.value.trim();
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    }
    timer = setTimeout(() => fetchSuggestions(query), 300);
});

async function fetchSuggestions(query) {
    const res = await fetch(`/api/search/suggest?q=${query}`);
    const data = await res.json();

    if (!data.length) {
        suggestionsBox.style.display = "none";
        return;
    }

    suggestionsBox.innerHTML = data
        .map(item => `
            <div class="search-item suggestion-entry" data-value="${item.title}">
                <span class="search-icon">🔍</span>
                <span>${item.title}</span>
            </div>
        `)
        .join("");
    suggestionsBox.style.display = "block";
}

function saveSearchHistory(term) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Avoid duplicates — move to top
    history = history.filter(item => item !== term);
    history.unshift(term);

    // Limit to 8 recent searches
    history = history.slice(0, 8);

    localStorage.setItem("searchHistory", JSON.stringify(history));
}


function selectSuggestion(value) {
    console.log("selectSuggestion triggered:", value); // debug
    input.value = value;
    saveSearchHistory(value); 
    form.submit();
}

function showSearchHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    if (!history.length) {
        suggestionsBox.style.display = "none";
        return;
    }

   suggestionsBox.innerHTML = history
    .map(item => `
        <div class="search-item history-entry" data-value="${item}">
            <span class="search-icon">🕘</span>
            <span class="history-text">${item}</span>
            <span class="delete-history" data-term="${item}">✖</span>
        </div>
    `)

    .join("");

    suggestionsBox.innerHTML += `
        <div class="clear-history">Clear search history</div>
    `;

    suggestionsBox.style.display = "block";
}

function deleteHistory(term, event) {
    event.preventDefault();
    event.stopPropagation();
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history = history.filter(item => item !== term);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    showSearchHistory(); 
}

function clearAllHistory(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    localStorage.removeItem("searchHistory");
    suggestionsBox.style.display = "none";
}

// Close suggestions on outside click
document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== input) {
        suggestionsBox.style.display = "none";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = input.value.trim();
        if (!value) {
            e.preventDefault();
            return;
        }
        form.submit();
    }
});

input.addEventListener("focus", () => {
    if(!input.value.trim()) showSearchHistory(); 
})

form.addEventListener("submit", (e) => {
    const value = input.value.trim();

    if (!value) {
        // Stop empty search
        e.preventDefault();
        suggestionsBox.style.display = "none";
        return;
    }

    saveSearchHistory(value);
});


suggestionsBox.addEventListener("click", (e) => {

    // DELETE button
    const deleteBtn = e.target.closest(".delete-history");
    if (deleteBtn) {
        deleteHistory(deleteBtn.dataset.term, e);
        return;
    }

    // CLEAR ALL button
    const clearBtn = e.target.closest(".clear-history");
    if (clearBtn) {
        e.preventDefault();
        e.stopPropagation();
        clearAllHistory();
        return;
    }

    // HISTORY entry
    const historyItem = e.target.closest(".history-entry");
    if (historyItem) {
        const value = historyItem.dataset.value;
        console.log("History clicked:", value);
        selectSuggestion(value);
        return;
    }

    // SUGGESTION entry
    const suggestion = e.target.closest(".suggestion-entry");
    if (suggestion) {
        const value = suggestion.dataset.value;
        console.log("Suggestion clicked:", value);
        selectSuggestion(value);
        return;
    }
});

document.getElementById("navbarNearMeBtn").addEventListener("click", async () => {
  try {
    const coords = await window.ensureLocation();

    const params = new URLSearchParams(window.location.search);
    params.set("lat", coords.lat);
    params.set("lng", coords.lng);
    params.set("radius", "50");

    window.location.search = params.toString();
  } catch {
    // user denied
  }
});







