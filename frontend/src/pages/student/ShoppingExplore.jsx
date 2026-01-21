import { useEffect, useState } from "react";
import { fetchClothes } from "../../api/owner";
import api from "../../api/api-base"; // ✅ for baseURL access

export default function ShoppingExplore() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchClothes();
        setItems(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch clothes", err);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛍 Explore Clothes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border rounded shadow p-4">
            <img
              src={`${api.defaults.baseURL}/uploads/${item.image}`} // ✅ dynamic baseURL
              alt={item.name}
              className="w-full h-48 object-cover mb-2 rounded"
            />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="font-bold mt-2">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
