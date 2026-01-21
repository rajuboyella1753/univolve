
import { getDistance } from "geolib";

const geoapifyKey = "db9755fcad3740a7a2a27c0780165cc2";

// 📍 Geocode a place name into coordinates
export const geocodePlace = async (placeName) => {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        placeName
      )}&apiKey=${geoapifyKey}`
    );
    const data = await res.json();
    const loc = data.features?.[0]?.geometry;
    return loc ? { lat: loc.coordinates[1], lng: loc.coordinates[0] } : null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
};

// 🗺️ Fetch interesting places nearby
export const fetchNearbyPlaces = async (lat, lng, category = "") => {
  const radius = 5000;
  const categoryParam = category ? category : "tourism.sights,entertainment,natural,leisure.park,catering.restaurant,religion";

  try {
    const res = await fetch(
      `https://api.geoapify.com/v2/places?categories=${categoryParam}&filter=circle:${lng},${lat},${radius}&limit=30&apiKey=db9755fcad3740a7a2a27c0780165cc2`
    );
    const data = await res.json();
    return data.features || [];
  } catch (err) {
    console.error("Nearby places error:", err);
    return [];
  }
};

// 📏 Calculate distance between user and place
export const calculateDistance = (start, end) => {
  return getDistance(start, end) / 1000;
};


const pexelsKey = "dEbSLVZObJKV2nHWAZaRuTGs5zLaPkOHoT6ym5lMAst0JDKHrmHKWPgY";

// 📷 Get image from Pexels based on place name
export const fetchImageFromPexels = async (query) => {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: pexelsKey,
        },
      }
    );
    const data = await res.json();
    return data.photos?.[0]?.src?.medium || null;
  } catch (err) {
    console.error("Pexels image fetch error:", err);
    return null;
  }
};
