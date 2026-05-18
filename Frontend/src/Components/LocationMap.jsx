import { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { AuthContext } from '../Context/createContext';
import { useEffect } from 'react';

import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const MapUpdater = ({selectedHospital}) => {
    const map = useMap();

    useEffect(() => {
        if (selectedHospital) {
            map.flyTo(
                [selectedHospital.latitude, selectedHospital.longitude],
                14,
                {animate: true}
            )
        }
    }, [selectedHospital]);

    return null;
}

const LocationMap = ({selectedHospital}) => {
    const { userLocation, hospitals } = useContext(AuthContext);
    if (!userLocation) return <p className='text-center h-full flex items-center justify-center border border-gray-200 rounded-xl'>Loading map...</p>;

    

    return (
        <MapContainer
            center={
                selectedHospital
                    ? [selectedHospital.latitude, selectedHospital.longitude]
                    : [userLocation.latitude, userLocation.longitude]
            }
            zoom={13}
            className='overflow-hidden h-full z-0'
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapUpdater selectedHospital={selectedHospital} />

            <Marker position={[userLocation.latitude, userLocation.longitude]} >
                <Popup className='text-error'>You are here</Popup>
            </Marker>

            {hospitals.map(hospital => (
                <Marker key={hospital.hospital_id} position={[hospital.latitude, hospital.longitude]}>
                    <Popup>
                        <strong>{hospital.name}</strong> <br />
                        {hospital.address}
                        {hospital.distance} km away
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default LocationMap;