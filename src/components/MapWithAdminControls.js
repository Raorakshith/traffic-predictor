import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  databaseURL: "YOUR_FIREBASE_DATABASE_URL",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const MapWithAdminControls = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0", // Replace with your Google Maps API key
  });

  const [blockedRoutes, setBlockedRoutes] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  useEffect(() => {
    // Fetch blocked routes from Firebase on load
    const routesRef = ref(db, "blockedRoutes");
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBlockedRoutes(Object.values(data));
      }
    });
  }, []);

  const handleMapClick = (e) => {
    const clickedPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (!startPoint) {
      setStartPoint(clickedPoint);
    } else if (!endPoint) {
      setEndPoint(clickedPoint);
    }
  };

  const saveBlockedRoute = () => {
    if (startPoint && endPoint) {
      const routeId = `${Date.now()}`;
      const routeData = { id: routeId, startPoint, endPoint };

      // Save to Firebase
      const routesRef = ref(db, `blockedRoutes/${routeId}`);
      set(routesRef, routeData);

      // Reset points after saving
      setBlockedRoutes([...blockedRoutes, routeData]);
      setStartPoint(null);
      setEndPoint(null);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <h2>Admin Controls for Blocking Routes</h2>
      <div>
        <button
          onClick={saveBlockedRoute}
          disabled={!startPoint || !endPoint}
          style={{ marginBottom: "10px", padding: "10px" }}
        >
          Block Selected Route
        </button>
      </div>
      <GoogleMap
        onClick={handleMapClick}
        center={{ lat: 37.7749, lng: -122.4194 }} // Default center (San Francisco)
        zoom={12}
        mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "8px" }}
      >
        {/* Highlight blocked routes */}
        {blockedRoutes.map((route) => (
          <Polyline
            key={route.id}
            path={[route.startPoint, route.endPoint]}
            options={{ strokeColor: "red", strokeWeight: 3 }}
          />
        ))}

        {/* Temporary route being selected */}
        {startPoint && endPoint && (
          <Polyline
            path={[startPoint, endPoint]}
            options={{ strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.6 }}
          />
        )}

        {/* Markers for start and end points */}
        {startPoint && <Marker position={startPoint} label="Start" />}
        {endPoint && <Marker position={endPoint} label="End" />}
      </GoogleMap>
    </div>
  );
};

export default MapWithAdminControls;
