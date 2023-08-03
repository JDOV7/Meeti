// alert("funciona");
// var map = L.map("mapa").setView([51.505, -0.09], 13);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   }).addTo(mapa);

import { OpenStreetMapProvider } from "leaflet-geosearch";

const lat = 19.19931902241358;
const lng = -96.16110377486035;
const map = L.map("mapa").setView([lat, lng], 15);
let markers = L.layerGroup().addTo(map);
let marker;

document.addEventListener("DOMContentLoaded", function () {
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const buscador = document.querySelector("#formbuscador");
  buscador.addEventListener("input", buscarDireccion);
});

function buscarDireccion(e) {
  if (e.target.value.length > 10) {
    // console.log(e.target.value);
    markers.clearLayers();

    const provider = new OpenStreetMapProvider();

    provider.search({ query: e.target.value }).then((resultado) => {
      console.log(resultado);
      // mostrart el mapa
      map.setView(resultado[0].bounds[0], 15);
      // agregar el pin
      marker = new L.marker(resultado[0].bounds[0], {
        draggable: true,
        autoPan: true,
      })
        .addTo(map)
        .bindPopup(resultado[0].label)
        .openPopup()
        .addTo(markers);

      marker.on("moveend", function (e) {
        const posicion = e.target.getLatLng();
        map.panTo(new L.LatLng(posicion.lat, posicion.lng));
      });

      // markers.addLayer(marker);
    });
  }
}
