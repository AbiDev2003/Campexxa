mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12", 
  projection: "globe", 
  zoom: 1, 
  center: campground.geometry.coordinates, 
  projection: "mercator"
});

new mapboxgl.Marker({ color: "#0A3D62" })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${campground.title}</h3>`
        )
  )
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

const openGoogleMapsBtn = document.getElementById("openGoogleMapsBtn");
openGoogleMapsBtn.addEventListener("click", () => {
  const [lng, lat] = campground.geometry.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(googleMapsUrl, "_blank");
});
