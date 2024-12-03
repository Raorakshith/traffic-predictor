import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (data.length > 0) {
      // Create heatmap layer
      const heatLayer = L.heatLayer(data, {
        radius: 25, // Adjust size of heat points
        blur: 15,   // Adjust blur effect
        maxZoom: 16, // Maximum zoom for the heatmap
        gradient: {
          0.1: "blue",
          0.3: "lime",
          0.5: "yellow",
          0.7: "orange",
          1: "red",
        }, // Color gradient
      });
      heatLayer.addTo(map);

      // Cleanup the layer on unmount
      return () => {
        map.removeLayer(heatLayer);
      };
    }
  }, [data, map]);

  return null;
};

const IndiaMapWithHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Sample static data for cities
    const locations = [
      { city: "Bangalore", lat: 12.9716, lon: 77.5946, value: 40 },
      { city: "Delhi", lat: 28.7041, lon: 77.1025, value: 60 },
      { city: "Mumbai", lat: 19.0760, lon: 72.8777, value: 80 },
    ];

    const heatmapPoints = locations.map((location) => [
      location.lat,
      location.lon,
      location.value,
    ]);
    setHeatmapData(heatmapPoints);
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Heatmap Layer */}
      <HeatmapLayer data={heatmapData} />

      {/* Markers */}
      <Marker position={[12.9716, 77.5946]}>
        <Popup>Bangalore</Popup>
      </Marker>
      <Marker position={[28.7041, 77.1025]}>
        <Popup>Delhi</Popup>
      </Marker>
      <Marker position={[19.0760, 72.8777]}>
        <Popup>Mumbai</Popup>
      </Marker>
    </MapContainer>
  );
};

export default IndiaMapWithHeatmap;
