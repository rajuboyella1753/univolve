// 📁 src/pages/student/PlaceOrder.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api-base";

export default function PlaceOrder() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [mobile, setMobile] = useState("");
  const [hostel, setHostel] = useState("");
  const [place, setPlace] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/owner/items/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch item", err);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/owner/order", {
        studentName,
        mobile,
        hostel,
        place,
        payment,
        itemId,
      });
      setMsg("✅ Order placed successfully!");
      setTimeout(() => navigate("/student/orders"), 2000);
    } catch (err) {
      console.error("❌ Order failed", err);
      setMsg("❌ Failed to place order.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">📦 Order Item</h2>

      {item && (
        <div className="mb-6">
          <img
            src={`${api.defaults.baseURL}/uploads/${item.image}`}
            alt={item.name}
            className="w-full h-48 object-cover rounded mb-2"
          />
          <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
          <p className="font-bold text-blue-600">₹{item.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Hostel Name"
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Room / Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Cash">Cash</option>
          <option value="Online">Online Payment</option>
        </select>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Confirm Order
        </button>

        {msg && <p className="text-center font-medium">{msg}</p>}
      </form>
    </div>
  );
}
