import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png", // Default marker icon
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function AddressDialog({ address, isAddressDialogOpen, setIsAddressDialogOpen }) {
  const defaultProps = {
    center: {
      lat: address?.latitude || 33.3152, // Default to Baghdad if no lat provided
      lng: address?.longitude || 44.3661,
    },
    zoom: 14,
  };

  return (
    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className="h-[400px] md:h-[500px] pr-4 w-full">
          <DialogHeader className={"mb-4"}>
            <DialogTitle>User Address</DialogTitle>
             <DialogDescription>
             {address?.city} ({address?.latitude},{address?.longitude})
            </DialogDescription>
          </DialogHeader>
          <div className="h-[400px] md:h-[440px] w-full">
            <MapContainer
              center={defaultProps.center}
              zoom={defaultProps.zoom}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tile URL
              />
              <Marker position={defaultProps.center} icon={defaultIcon}>
                <Popup>
                  {address?.name || "No name provided for this address"}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
