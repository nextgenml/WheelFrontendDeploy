const axios = require("axios");

async function getGeocode(locationName) {
  const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        address: locationName,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const result = response.data;

    if (result.status === "OK") {
      const location = result.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return { latitude, longitude };
    } else {
      console.error(`Geocoding failed with status: ${result.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error during API call:", error.message);
    return null;
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const radLat1 = (lat1 * Math.PI) / 180;
  const radLon1 = (lon1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const radLon2 = (lon2 * Math.PI) / 180;

  const dLat = radLat2 - radLat1;
  const dLon = radLon2 - radLon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distance = R * c;

  return distance.toFixed(2);
}

module.exports = {
  getGeocode,
  calculateDistance,
};
