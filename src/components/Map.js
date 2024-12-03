// import React, { useEffect } from "react";
// import { GoogleMap, Marker, TrafficLayer, useLoadScript } from "@react-google-maps/api";

// const Map = ({ latitude, longitude }) => {
//   useEffect(() => {
//     console.log(latitude, longitude);
//   }, [latitude, longitude]);

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0", // Replace with your Google Maps API key
//   });

//   if (!isLoaded) return <div>Loading Map...</div>;

//   return (
//     <GoogleMap
//       center={{ lat: latitude, lng: longitude }}
//       zoom={12}
//       mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "8px" }}
//     >
//       {/* Marker for the given location */}
//       <Marker position={{ lat: latitude, lng: longitude }} />

//       {/* Traffic layer to show traffic data */}
//       <TrafficLayer />
//     </GoogleMap>
//   );
// };

// export default Map;


import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  TrafficLayer,
  useLoadScript,
} from "@react-google-maps/api";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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
const database = getDatabase(app);

const Map = ({ latitude, longitude }) => {
  const [blockedRoutes, setBlockedRoutes] = useState([]); // Store blocked route data
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0", // Replace with your Google Maps API key
  });

  // Fetch blocked routes from Firebase
  useEffect(() => {
    const fetchBlockedRoutes = () => {
      const blockedRoutesRef = ref(database, "blockedRoutes");
      onValue(blockedRoutesRef, (snapshot) => {
        const data = snapshot.val();
        const routes = Object.values(data || {}).map((route) => ({
          id: route.id,
          startPoint: route.startPoint,
          endPoint: route.endPoint,
        }));
        setBlockedRoutes(routes);
      });
    };

    fetchBlockedRoutes();
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={{ lat: latitude, lng: longitude }}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "8px" }}
    >
      {/* Traffic Layer */}
      <TrafficLayer />

      {/* Markers for user location */}
      <Marker position={{ lat: latitude, lng: longitude }} />

      {/* Blocked Routes */}
      {blockedRoutes.map((route) => (
        <Polyline
          key={route.id}
          path={[
            { lat: route.startPoint.lat, lng: route.startPoint.lng },
            { lat: route.endPoint.lat, lng: route.endPoint.lng },
          ]}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
