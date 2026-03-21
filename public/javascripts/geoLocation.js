// near me button in navbar implements this logic to find lat/long, Live tracking too. 
// Production-ready geolocation with permission handling
let geoWatchId = null;
let currentCoords = null;

function startLocationTracking() {
  if (!navigator.geolocation || geoWatchId !== null) return;

  geoWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      currentCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        updatedAt: Date.now()
      };
      localStorage.setItem("userCoords", JSON.stringify(currentCoords));
    },
    (err) => {
      console.warn("Geolocation error:", err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
}


// Ensure location is available before using filters / near me
async function ensureLocation() {
  const cached = localStorage.getItem("userCoords");
  if (cached) return JSON.parse(cached);

  startLocationTracking();

  // wait until first location fix arrives
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const data = localStorage.getItem("userCoords");
      if (data) {
        clearInterval(interval);
        resolve(JSON.parse(data));
      }
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      reject("Location not ready");
    }, 10000);
  });
}

// expose globally
window.ensureLocation = ensureLocation;

// start tracking as soon as page loads
document.addEventListener("DOMContentLoaded", () => {
  startLocationTracking();
});




