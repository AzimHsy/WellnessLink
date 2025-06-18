let map,
  service,
  clinics = [],
  markers = [];

function startClinicLocator() {
  // Show UI elements when the button is clicked
  document.getElementById("searchBox").style.display = "block";
  document.getElementById("manualLocation").style.display = "block";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        initMap(location);
        fetchClinics(location);
      },
      () => {
        alert("Location denied. Use manual entry.");
      }
    );
  }
}

function initMap(location) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: location,
    zoom: 14,
  });
  new google.maps.Marker({ position: location, map, title: "You" });
  service = new google.maps.places.PlacesService(map);
}

function fetchClinics(location) {
  service.textSearch(
    { location: location, radius: 2000, query: "clinic" },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        displayClinics(results);
      }
    }
  );
}

function manualSearch() {
  const address = document.getElementById("locationInput").value;
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (res, status) => {
    if (status === "OK") {
      const loc = res[0].geometry.location;
      initMap(loc);
      fetchClinics(loc);
    } else {
      alert("Location not found.");
    }
  });
}

function displayClinics(results) {
  clinics = results;
  markers.forEach((m) => m.setMap(null));
  markers = [];

  const clinicContainer = document.getElementById("clinics");
  clinicContainer.innerHTML = ""; // Clear previous cards

  results.forEach((place) => {
    const placeId = place.place_id;

    service.getDetails(
      {
        placeId: placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "geometry",
          "photos",
        ],
      },
      (detailedPlace, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const card = createClinicCard(detailedPlace);
          clinicContainer.appendChild(card); // ✅ Append here

          const marker = new google.maps.Marker({
            map,
            position: detailedPlace.geometry.location,
            title: detailedPlace.name,
          });
          markers.push(marker);
        }
      }
    );
  });
}

function createClinicCard(place) {
  const card = document.createElement("div");
  card.className = "clinic-card";

  const photoUrl = place.photos
    ? place.photos[0].getUrl()
    : "img/fail-load.png";

  card.innerHTML = `
  <div class="img-container">
    <img src="${photoUrl}" alt="${place.name}" />
    </div>
    <div class="clinic-info">
      <h3>${place.name}</h3>
      <p><span class="icon"><ion-icon name="call"></ion-icon></span> ${
        place.formatted_phone_number || "Not Available"
      }</p>
      <p><span class="icon"><ion-icon name="pin"></ion-icon></span> ${
        place.formatted_address
      }</p>
    </div>
  `;

  card.addEventListener("click", () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place.name
    )},${place.geometry.location.lat()},${place.geometry.location.lng()}`;
    window.open(mapsUrl, "_blank");
  });

  return card;
}

function filterClinics() {
  const q = document.getElementById("searchBox").value.toLowerCase();
  const list = document.getElementById("clinics");
  list.innerHTML = "";

  clinics
    .filter((c) => c.name.toLowerCase().includes(q))
    .forEach((place) => {
      const card = createClinicCard(place);
      list.appendChild(card);
    });
}
