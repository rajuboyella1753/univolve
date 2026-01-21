import { useEffect, useState } from "react";
import StudentNavbar from "./../StudentNavbar";
import ownerApi from "../../api/owner";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_API
    : process.env.REACT_APP_PROD_API;

const getCategoryLabel = (category) => {
  switch (category) {
    case "food":
      return "🍽️ Food";
    case "clothes":
      return "👗 Clothes";
    case "room":
      return "📏 Room";
    default:
      return "📦 Other";
  }
};

export default function ExploreItems() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    mobile: "",
    hostel: "",
    place: "",
    payment: "Cash",
  });
console.log("Modified ExploreItems page...");

  useEffect(() => {
    ownerApi
      .get("/items/all")
      .then((res) => {
        setItems(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.error("Failed to load items", err);
        setError("⚠️ Failed to load items. Please try again.");
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    filterItems(categoryFilter, genderFilter, value);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryFilter(value);
    filterItems(value, genderFilter, search);
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGenderFilter(value);
    filterItems(categoryFilter, value, search);
  };

  const filterItems = (category, gender, searchTerm) => {
    setFiltered(
      items.filter((item) => {
        const categoryMatch = !category || item.category === category;
        const genderMatch = category === "clothes" ? (!gender || item.gender === gender) : true;
        const searchMatch =
          item.name?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm) ||
          item.ownerName?.toLowerCase().includes(searchTerm);

        return categoryMatch && genderMatch && searchMatch;
      })
    );
  };

  const handleSubmitOrder = async () => {
    const { name, mobile, hostel, place } = studentInfo;

    if (!name || !mobile || !hostel || !place) {
      alert("⚠️ Please fill in all fields");
      return;
    }

    try {
      await ownerApi.post("/order", {
        studentName: name,
        mobile,
        hostel,
        place,
        payment: studentInfo.payment,
        itemId: selectedItem._id,
      });

      alert("✅ Order placed successfully!");
      setShowModal(false);
      setStudentInfo({ name: "", mobile: "", hostel: "", place: "", payment: "Cash" });
    } catch (err) {
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-100 px-4 pt-24 pb-10">
      <StudentNavbar />

      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        🔍 Explore Campus Items
      </h2>

      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="w-full sm:w-1/3 px-4 py-3 rounded-xl border border-purple-300 bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">🌐 All Categories</option>
          <option value="food">🍽️ Food</option>
          <option value="clothes">👕 Clothes</option>
          <option value="room">🛏️ Hostel / Room</option>
        </select>

        {categoryFilter === "clothes" && (
          <select
            value={genderFilter}
            onChange={handleGenderChange}
            className="w-full sm:w-1/3 px-4 py-3 rounded-xl border border-purple-300 bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Genders</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        )}

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search food, clothes, hostel name..."
          className="w-full sm:w-1/2 p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {error && <p className="text-center text-red-500 font-medium mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">No items found.</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between"
            >
              <img
                src={`${BASE_URL}/uploads/${item.image}`}
                alt={item.name}
                className="w-full max-h-64 object-contain rounded-lg mb-3 bg-white"
                style={{ objectPosition: "center", borderRadius: "12px" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">
                  🏢 From: <span className="font-semibold">{item.ownerName || "Unknown"}</span>
                </p>
              </div>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-blue-600 font-semibold">₹{item.price}</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                  {getCategoryLabel(item.category)}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {item.category === "room" ? (
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded"
                    onClick={() => alert(`📞 Contact ${item.ownerName}`)}
                  >
                    📞 Contact
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded"
                    >
                      🛒 Order Now
                    </button>
                    {item.category === "food" && (
                      <button
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-2 rounded"
                        onClick={() => alert(`📅 Table booking at ${item.ownerName}`)}
                      >
                        📅 Book Table
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4">
              Order: {selectedItem.name}
            </h2>

            <input
              type="text"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              placeholder="Your Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={studentInfo.mobile}
              onChange={(e) => setStudentInfo({ ...studentInfo, mobile: e.target.value })}
              placeholder="Mobile Number"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={studentInfo.hostel}
              onChange={(e) => setStudentInfo({ ...studentInfo, hostel: e.target.value })}
              placeholder="Hostel Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              value={studentInfo.place}
              onChange={(e) => setStudentInfo({ ...studentInfo, place: e.target.value })}
              placeholder="Place / Room Number"
              className="w-full mb-2 p-2 border rounded"
            />
            <select
              value={studentInfo.payment}
              onChange={(e) => setStudentInfo({ ...studentInfo, payment: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="Cash">💵 Cash</option>
              <option value="Online">💳 Online</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOrder}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
