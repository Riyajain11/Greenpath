import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders/${user._id}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    await axios.put(`http://localhost:5000/api/orders/cancel/${id}`);
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    await axios.delete(`http://localhost:5000/api/orders/${id}`);
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <h1 className="text-2xl text-green-700 font-bold mb-6">📦 My Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">
              {order.fertilizer?.name}
            </h3>

            <p><strong>Farmer:</strong> {user.name}</p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <p className="text-green-600 font-medium mt-2">
              🚚 Delivery within 1 day
            </p>

            <div className="flex gap-3 mt-4">
              {order.status === "paid" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;