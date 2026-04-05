mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "cluster-map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.on("load", () => {
  map.addSource("campgrounds", {
    type: "geojson",
    generateId: true,
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#03A9F4",
        10,
        "#3B26D4",
        30,
        "#231680",
      ],
      "circle-radius": [
        "step", 
        [
          "get", "point_count"], 
          15, 
          10, 
          20, 
          30, 
          25
        ],
      "circle-emissive-strength": 1,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
      "circle-emissive-strength": 1,
    },
  });
  map.addInteraction("click-clusters", {
    type: "click",
    target: { layerId: "clusters" },
    handler: (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource('campgrounds')
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    },
  });
  map.addInteraction("click-unclustered-point", {
    type: "click",
    target: { layerId: "unclustered-point" },
    handler: (e) => {
      const {popUpMarkup} = e.feature.properties;

      const coordinates = e.feature.geometry.coordinates.slice();

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popUpMarkup)
        .addTo(map);
    },
  });

  map.addInteraction("clusters-mouseenter", {
    type: "mouseenter",
    target: { layerId: "clusters" },
    handler: () => {
      map.getCanvas().style.cursor = "pointer";
    },
  });

  map.addInteraction("clusters-mouseleave", {
    type: "mouseleave",
    target: { layerId: "clusters" },
    handler: () => {
      map.getCanvas().style.cursor = "";
    },
  });

  map.addInteraction("unclustered-mouseenter", {
    type: "mouseenter",
    target: { layerId: "unclustered-point" },
    handler: () => {
      map.getCanvas().style.cursor = "pointer";
    },
  });

  map.addInteraction("unclustered-mouseleave", {
    type: "mouseleave",
    target: { layerId: "unclustered-point" },
    handler: () => {
      map.getCanvas().style.cursor = "";
    },
  });
});

map.addControl(new mapboxgl.NavigationControl());
