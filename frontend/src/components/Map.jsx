
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { Icon } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { CardDescription, CardHeader, CardTitle } from "./ui/card";

// const defaultIcon = new Icon({
//   iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png", // Default marker icon
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// export default function Map({title, data, }) {
//   const defaultProps = {
//     center: {
//       lat: data?.latitude || 33.3152, // Default to Baghdad if no lat provided
//       lng: data?.longitude || 44.3661,
//     },
//     zoom: 14,
//   };

//   return (

 
//                  data?.latitude&& data?.longitude? (
//                     <>

//           <CardHeader className={"mb-4"}>
//             <CardTitle>{title}</CardTitle>
//              <CardDescription>
//              {data?.name} ({data?.latitude},{data?.longitude})
//             </CardDescription>
//           </CardHeader>
//           <div className="h-[400px] md:h-[440px] w-full">
//             <MapContainer
//               center={defaultProps.center}
//               zoom={defaultProps.zoom}
//               scrollWheelZoom={false}
//               style={{ height: "100%", width: "100%" }}
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tile URL
//               />
//               <Marker position={defaultProps.center} icon={defaultIcon}>
//                 <Popup>
//                   {data?.name || "No name provided for this address"}
//                 </Popup>
//               </Marker>
//             </MapContainer>
//           </div>
//                     </>
//           ) : (
//               <div className="w-[75%] h-[300px] bg-accent rounded-sm flex justify-center items-center">

//                  Please provide longitude & latitude to view location on the map

//               </div>
//             )
 

//   );
// }
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useEffect } from "react";

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png", // Default marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ title, data }) {
  const center = data?.latitude && data?.longitude
    ? [parseFloat(data.latitude), parseFloat(data.longitude)]
    : [33.3152, 44.3661]; // default to Baghdad

  // Helper to update map center on data change
  function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
      if (center) map.setView(center, map.getZoom());
    }, [center]);
    return null;
  }

  return data?.latitude && data?.longitude ? (
    <>
      <CardHeader className={"mb-4"}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {data?.name} ({data?.latitude},{data?.longitude})
        </CardDescription>
      </CardHeader>
      <div className="h-[400px] md:h-[440px] w-full">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={center} />
          <Marker position={center} icon={defaultIcon}>
            <Popup>
              {data?.name || "No name provided for this address"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  ) : (
    <div className="w-[75%] h-[300px] bg-accent rounded-sm flex justify-center items-center">
      Please provide longitude & latitude to view location on the map
    </div>
  );
}
