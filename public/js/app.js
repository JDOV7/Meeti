// alert("funciona");

import { OpenStreetMapProvider } from "leaflet-geosearch";

// obrener valores de la bd

const lat = document.querySelector("#lat").value || 19.19931902241358;
const lng = document.querySelector("#lng").value || -96.16110377486035;

const direccion = document.querySelector("#direccion").value || "";

const map = L.map("mapa").setView([lat, lng], 15);
let geocodeService = L.esri.Geocoding.geocodeService();

let markers = L.layerGroup().addTo(map);
let marker;

// coloae wl ping en edicion
if (lat && lng) {
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  })
    .addTo(map)
    .bindPopup(direccion)
    .openPopup()
    .addTo(markers);

  marker.on("moveend", function (e) {
    const posicion = e.target.getLatLng();
    map.panTo(new L.LatLng(posicion.lat, posicion.lng));
    //reverse cuando el usuairo reubica el ping
    geocodeService
      .reverse()
      .latlng(posicion, 15)
      .run(function (error, result) {
        llenarInputs(result);
        // console.log(result);
        //asigna los valoes al popup del marker
        marker.bindPopup(result.address.LongLabel);
      });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const buscador = document.querySelector("#formbuscador");
  buscador.addEventListener("input", buscarDireccion);
});

function buscarDireccion(e) {
  if (e.target.value.length > 10) {
    // console.log(e.target.value);
    markers.clearLayers();

    const provider = new OpenStreetMapProvider();

    //utliar el provide o Geocoder

    

    // const geocodeService = L.esri.Geocoding.reverseGeocode();

    provider.search({ query: e.target.value }).then((resultado) => {
      map.setView(resultado[0].bounds[0], 15);
      markers.clearLayers();
      geocodeService
        .reverse()
        .latlng(resultado[0].bounds[0], 15)
        .run(function (error, result) {
          llenarInputs(result);
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
            //reverse cuando el usuairo reubica el ping
            geocodeService
              .reverse()
              .latlng(posicion, 15)
              .run(function (error, result) {
                llenarInputs(result);
                // console.log(result);
                //asigna los valoes al popup del marker
                marker.bindPopup(result.address.LongLabel);
              });
          });

          markers.addLayer(marker);
        });
    });
  }
}

function llenarInputs(resultado) {
  console.log(resultado);
  document.querySelector("#direccion").value = resultado.address.Address || "";
  document.querySelector("#ciudad").value = resultado.address.Subregion || "";
  document.querySelector("#estado").value = resultado.address.Region || "";
  document.querySelector("#pais").value = resultado.address.CountryCode || "";
  document.querySelector("#lat").value = resultado.latlng.lat || "";
  document.querySelector("#lng").value = resultado.latlng.lng || "";
}

// var map = L.map('mapa').setView([40.725, -73.985], 7);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// var geocodeService = L.esri.Geocoding.geocodeService();

// map.on('click', function(e) {
//   geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
//     L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr).openPopup();
//   });
// });

// var message;

// message = geocodeService.reverse().latlng([40.725, -73.985]).run(function(error, result) {
//   //alert(result.address.Match_addr); //this alert works here ok and can retur addrress
//   return result.address.Match_addr;
// });

// //this alert won't work, why I can get the address here outside the function
// alert(message);
