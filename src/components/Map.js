// import React, { useEffect } from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// const Map = ({ latitude, longitude }) => {
//     useEffect(()=>{
//         console.log(latitude, longitude);
//       },[]);
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
//       <Marker position={{ lat: latitude, lng: longitude }} />
//     </GoogleMap>
//   );
// };

// export default Map;


import React, { useEffect } from "react";
import { GoogleMap, Marker, TrafficLayer, useLoadScript } from "@react-google-maps/api";

const Map = ({ latitude, longitude }) => {
  useEffect(() => {
    console.log(latitude, longitude);
  }, [latitude, longitude]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD590z__itIHB85Rrz0XJxEpi-PVYPs2b0", // Replace with your Google Maps API key
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      center={{ lat: latitude, lng: longitude }}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "8px" }}
    >
      {/* Marker for the given location */}
      <Marker position={{ lat: latitude, lng: longitude }} />

      {/* Traffic layer to show traffic data */}
      <TrafficLayer />
    </GoogleMap>
  );
};

export default Map;
