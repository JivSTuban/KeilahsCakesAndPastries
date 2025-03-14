"use client"

import dynamic from "next/dynamic"

const MapComponent = dynamic(
  () => import("react-leaflet").then((mod) => {
    return Promise.all([
      import("leaflet/dist/leaflet.css"),
      import("leaflet"),
      Promise.resolve(mod)
    ]).then(([_, L, reactLeaflet]) => {
      const icon = L.default.icon({
        iconUrl: "https://scontent.fceb1-5.fna.fbcdn.net/v/t39.30808-6/426900251_370484772396270_3403493520241802778_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIDrfyZmL-oE1ycZ-X_MQXbPhthiOO1QZs-G2GI47VBrMJj_G5fy6ZUo35O9k1d-DHNB3Xjg1cXgM6t1ddUcxZ&_nc_ohc=P1Chvmf13jMQ7kNvgG5OkGc&_nc_oc=AdhOMMRHgb1ONJ2z_EbZOy2HUwSIeM2r2dEZZExpI6xxTjQXJheGc4XEiO8PB0FxINA&_nc_zt=23&_nc_ht=scontent.fceb1-5.fna&_nc_gid=AJiTnINNPMUUu7NVoyHi3iq&oh=00_AYCBHCOABar9ugKSADR3yn6VwOMTjyGFyuLxvrxBc7FluQ&oe=67CCB9CD",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })

      function Map() {
        return (
          <div className="w-full h-[400px] bg-gray-100 rounded-xl transition-all duration-300 hover:shadow-lg">
            <reactLeaflet.MapContainer
              center={[10.295388531065718, 123.96303790653828]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <reactLeaflet.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <reactLeaflet.Marker 
                position={[10.295388531065718, 123.96303790653828]}
                icon={icon}
              >
                <reactLeaflet.Popup>Keilah's Cakes and Pastries</reactLeaflet.Popup>
              </reactLeaflet.Marker>
            </reactLeaflet.MapContainer>
          </div>
        )
      }

      return Map
    })
  }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse" />
    )
  }
)

export function LocationMap() {
  return <MapComponent />
}
