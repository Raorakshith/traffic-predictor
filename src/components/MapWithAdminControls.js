// import React, { useState, useEffect } from "react";
// import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
// import { getDatabase, ref, set, onValue } from "firebase/database";
// import { initializeApp } from "firebase/app";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDbnmu0RyE32dnaJf1Oo2KsVRxugRPhAtE",
//   authDomain: "otpfirebaseproject-70f8b.firebaseapp.com",
//   databaseURL: "https://otpfirebaseproject-70f8b.firebaseio.com",
//   projectId: "otpfirebaseproject-70f8b",
//   storageBucket: "otpfirebaseproject-70f8b.appspot.com",
//   messagingSenderId: "376076841719",
//   appId: "1:376076841719:web:5fd83c4d4ff214122ad9f2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// const MapWithAdminControls = () => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0", // Replace with your Google Maps API key
//   });

//   const [blockedRoutes, setBlockedRoutes] = useState([]);
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);

//   useEffect(() => {
//     // Fetch blocked routes from Firebase on load
//     const routesRef = ref(db, "blockedRoutes");
//     onValue(routesRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setBlockedRoutes(Object.values(data));
//       }
//     });
//   }, []);

//   const handleMapClick = (e) => {
//     const clickedPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };

//     if (!startPoint) {
//       setStartPoint(clickedPoint);
//     } else if (!endPoint) {
//       setEndPoint(clickedPoint);
//     }
//   };

//   const saveBlockedRoute = () => {
//     if (startPoint && endPoint) {
//       const routeId = `${Date.now()}`;
//       const routeData = { id: routeId, startPoint, endPoint };

//       // Save to Firebase
//       const routesRef = ref(db, `blockedRoutes/${routeId}`);
//       set(routesRef, routeData);

//       // Reset points after saving
//       setBlockedRoutes([...blockedRoutes, routeData]);
//       setStartPoint(null);
//       setEndPoint(null);
//     }
//   };

//   if (!isLoaded) return <div>Loading Map...</div>;

//   return (
//     <div>
//       <h2>Admin Controls for Blocking Routes</h2>
//       <div>
//         <button
//           onClick={saveBlockedRoute}
//           disabled={!startPoint || !endPoint}
//           style={{ marginBottom: "10px", padding: "10px" }}
//         >
//           Block Selected Route
//         </button>
//       </div>
//       <GoogleMap
//         onClick={handleMapClick}
//         center={{ lat: 37.7749, lng: -122.4194 }} // Default center (San Francisco)
//         zoom={12}
//         mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "8px" }}
//       >
//         {/* Highlight blocked routes */}
//         {blockedRoutes.map((route) => (
//           <Polyline
//             key={route.id}
//             path={[route.startPoint, route.endPoint]}
//             options={{ strokeColor: "red", strokeWeight: 3 }}
//           />
//         ))}

//         {/* Temporary route being selected */}
//         {startPoint && endPoint && (
//           <Polyline
//             path={[startPoint, endPoint]}
//             options={{ strokeColor: "blue", strokeWeight: 3, strokeOpacity: 0.6 }}
//           />
//         )}

//         {/* Markers for start and end points */}
//         {startPoint && <Marker position={startPoint} label="Start" />}
//         {endPoint && <Marker position={endPoint} label="End" />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MapWithAdminControls;


import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbnmu0RyE32dnaJf1Oo2KsVRxugRPhAtE",
  authDomain: "otpfirebaseproject-70f8b.firebaseapp.com",
  databaseURL: "https://otpfirebaseproject-70f8b.firebaseio.com",
  projectId: "otpfirebaseproject-70f8b",
  storageBucket: "otpfirebaseproject-70f8b.appspot.com",
  messagingSenderId: "376076841719",
  appId: "1:376076841719:web:5fd83c4d4ff214122ad9f2",
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
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default center (Bangalore)
  const [regions] = useState([
    { name: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
    { name: "Mumbai", latitude: 19.076, longitude: 72.8777 },
    { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
  ]);

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

  const handleRegionChange = (region) => {
    setCenter({ lat: region.latitude, lng: region.longitude });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Control Your Block Routes</h1>
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
        <select
          onChange={(e) => handleRegionChange(regions[e.target.value])}
          style={{ padding: "10px", marginRight: "10px" }}
        >
          {regions.map((region, index) => (
            <option key={region.name} value={index}>
              {region.name}
            </option>
          ))}
        </select>
        <button
          onClick={saveBlockedRoute}
          disabled={!startPoint || !endPoint}
          style={{ padding: "10px" }}
        >
          Block Selected Route
        </button>
      </div>
      <GoogleMap
        onClick={handleMapClick}
        center={center}
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
