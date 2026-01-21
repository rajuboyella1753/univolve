
import { useEffect, useState } from "react";
import ownerApi from "../../api/owner";
import StuNav from "../StudentNavbar";

export default function StudentFoodOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await ownerApi.get("/student-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <StuNav />
      <div className="pt-28 px-4 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
            🍽️ Your Food Orders
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-600">No orders found.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow-lg rounded-xl p-6 border border-purple-100 transition-transform hover:scale-[1.01]"
                >
                  <h3 className="text-xl font-semibold text-purple-900 mb-1">
                    {order.item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{order.item.description}</p>

                  <div className="flex justify-between items-center flex-wrap text-sm text-gray-700 mb-2">
                    <span>💰 Price: ₹{order.item.price}</span>
                    <span>🏠 Ordered from: <span className="text-black font-medium">{order.ownerName}</span></span>
                  </div>

                  <div className="flex justify-between items-center flex-wrap">
                    <p className="text-green-700 font-semibold">Status: {order.status}</p>
                    <p className="text-gray-400 text-xs">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
