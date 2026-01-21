// // helpers/fetchPlaceImage.js

// const GOOGLE_API_KEY = "AIzaSyDXIZ2C3aWIvmc8Uh4nUQt1YQSYZCr9vtw";
// const PEXELS_KEY = "dEbSLVZObJKV2nHWAZaRuTGs5zLaPkOHoT6ym5lMAst0JDKHrmHKWPgY";

// // ✅ 1. Fetch detailed place info using place_id for accurate image
// const fetchPhotoByPlaceId = async (placeId) => {
//   try {
//     const detailRes = await fetch(
//       `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`
//     );
//     const detailData = await detailRes.json();
//     const photo = detailData.result?.photos?.[0];

//     if (!photo?.photo_reference) return null;

//     return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
//   } catch (err) {
//     console.error("Error fetching image by place_id:", err);
//     return null;
//   }
// };

// // ✅ 2. Search for a place, get place_id, and then fetch image
// const fetchImageFromGoogle = async (query) => {
//   try {
//     const searchRes = await fetch(
//       `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
//     );

//     const searchData = await searchRes.json();
//     const placeId = searchData.candidates?.[0]?.place_id;

//     if (!placeId) return null;

//     return await fetchPhotoByPlaceId(placeId);
//   } catch (err) {
//     console.error("Google Places image fetch error:", err);
//     return null;
//   }
// };

// // ✅ 3. Wikimedia image fetch using Wikidata ID
// const fetchImageFromWikimedia = async (wikidataId) => {
//   try {
//     const res = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
//     const data = await res.json();

//     const entity = data.entities[wikidataId];
//     const title = entity?.sitelinks?.enwiki?.title;

//     if (!title) return null;

//     const wikiRes = await fetch(
//       `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
//     );
//     const wikiData = await wikiRes.json();
//     return wikiData.thumbnail?.source || null;
//   } catch (err) {
//     console.error("Wikimedia image fetch error:", err);
//     return null;
//   }
// };

// // ✅ 4. Pexels fallback
// const fetchImageFromPexels = async (query) => {
//   try {
//     const res = await fetch(
//       `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
//       {
//         headers: {
//           Authorization: PEXELS_KEY,
//         },
//       }
//     );
//     const data = await res.json();
//     return data.photos?.[0]?.src?.medium || null;
//   } catch (err) {
//     console.error("Pexels image fetch error:", err);
//     return null;
//   }
// };

// // ✅ 5. Unified place image fetcher (calls above functions)
// export const getPlaceImage = async (place) => {
//   const props = place.properties;
//   const placeName = props?.name;
//   const wikidataId = props?.wikidata;

//   let image = null;

//   // 🥇 1. Try fetching image from Google using place_id
//   if (placeName) {
//     image = await fetchImageFromGoogle(placeName);
//   }

//   // 🥈 2. Try Wikimedia if Google failed
//   if (!image && wikidataId) {
//     image = await fetchImageFromWikimedia(wikidataId);
//   }

//   // 🥉 3. Fallback to Pexels if needed
//   if (!image && placeName) {
//     image = await fetchImageFromPexels(`${placeName} landmark`);
//   }

//   return image;
// };


const GOOGLE_API_KEY = "AIzaSyDXIZ2C3aWIvmc8Uh4nUQt1YQSYZCr9vtw";
const PEXELS_KEY = "dEbSLVZObJKV2nHWAZaRuTGs5zLaPkOHoT6ym5lMAst0JDKHrmHKWPgY";
const GEOAPIFY_KEY = "db9755fcad3740a7a2a27c0780165cc2"; // ✅ Use this for Geoapify

// 1. Google Places – search & fetch image
const fetchPhotoByPlaceId = async (placeId) => {
  try {
    const detailRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`
    );
    const detailData = await detailRes.json();
    const photo = detailData.result?.photos?.[0];

    if (!photo?.photo_reference) return null;

    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
  } catch (err) {
    console.error("Google image fetch failed:", err);
    return null;
  }
};

const fetchImageFromGoogle = async (query) => {
  try {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
    );
    const searchData = await searchRes.json();
    const placeId = searchData.candidates?.[0]?.place_id;

    if (!placeId) return null;

    return await fetchPhotoByPlaceId(placeId);
  } catch (err) {
    console.error("Google image fetch error:", err);
    return null;
  }
};

// 2. Wikimedia – if Wikidata ID exists
const fetchImageFromWikimedia = async (wikidataId) => {
  try {
    const res = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
    const data = await res.json();

    const entity = data.entities[wikidataId];
    const title = entity?.sitelinks?.enwiki?.title;

    if (!title) return null;

    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    const wikiData = await wikiRes.json();
    return wikiData.thumbnail?.source || null;
  } catch (err) {
    console.error("Wikimedia image fetch error:", err);
    return null;
  }
};

// 3. Geoapify – fetch a matching place + image
const fetchImageFromGeoapify = async (query) => {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=place:${encodeURIComponent(query)}&limit=1&apiKey=${GEOAPIFY_KEY}`
    );
    const data = await res.json();
    const photoUrl = data.features?.[0]?.properties?.image;

    return photoUrl || null;
  } catch (err) {
    console.error("Geoapify image fetch error:", err);
    return null;
  }
};

// 4. Pexels fallback – general scenic match
const fetchImageFromPexels = async (query) => {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_KEY,
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

// Unified final function
export const getPlaceImage = async (place) => {
  const props = place.properties || {};
  const name = props.name || place.name || "";
  const wikidataId = props.wikidata;

  if (!name) return null;

  let image = null;

  // ✅ Priority 1: Google
  image = await fetchImageFromGoogle(name);
  if (image) return image;

  // ✅ Priority 2: Wikimedia (if wikidata ID exists)
  if (wikidataId) {
    image = await fetchImageFromWikimedia(wikidataId);
    if (image) return image;
  }

  // ✅ Priority 3: Geoapify
  image = await fetchImageFromGeoapify(name);
  if (image) return image;

  // ✅ Priority 4: Pexels fallback
  image = await fetchImageFromPexels(`${name} landmark`);
  return image;
};
