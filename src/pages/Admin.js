import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";
import { Modal, Button } from "react-bootstrap";
import TtsToggle from "../components/TtsToggle";
import UserManagement from "../components/UserManagement";
import { InvisibleLastRow } from "../util/InvisibleLastRow";

const Admin = () => {
  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get("/products/admin");
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get("/orders/admin");
    setOrders(res.data);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const openEditModal = (product) => {
    setEditing({ ...product, categoryId: product.category?.id });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/products/admin/${editing.id}`, editing);
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await axios.delete(`/products/admin/${id}`);
    fetchProducts();
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  const prepareProductForSubmit = (product) => ({
    ...product,
    category: { id: product.categoryId },
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const productToSubmit = prepareProductForSubmit(newProduct);
    await axios.post("/products/admin", productToSubmit);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      stock: "",
      imageUrl: "",
      categoryId: "",
    });
    fetchProducts();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧑‍💼 Admin Panel</h2>
      <TtsToggle />

      <div className="btn-group my-3">
        {["products", "orders", "users"].map((tabName) => (
          <button
            key={tabName}
            className={`btn ${
              tab === tabName ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setTab(tabName)}
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <>
          <h4>Manage Products</h4>
          <form onSubmit={handleAddProduct} className="row g-2 mb-4">
            {[
              "name",
              "description",
              "price",
              "stock",
              "imageUrl",
              "categoryId",
            ].map((field, i) => (
              <div className="col-md-4" key={i}>
                <input
                  className="form-control"
                  placeholder={field}
                  type={
                    field === "price" || field === "stock" ? "number" : "text"
                  }
                  value={newProduct[field]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [field]: e.target.value })
                  }
                  required
                />
              </div>
            ))}
            <div className="col-12">
              <button className="btn btn-success">Add Product</button>
            </div>
          </form>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>{p.category?.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEditModal(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <InvisibleLastRow colSpan={5} />
            </tbody>
          </table>
        </>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <>
          <h4>Customer Orders</h4>
          {orders.map((order) => (
            <div className="card mb-3" key={order.id}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <strong>Order #{order.id}</strong> -{" "}
                  {dayjs(order.orderDateTime).format("MMM D, YYYY h:mm A")}
                </div>
                <div className="d-flex align-items-center">
                  <label className="me-2">Status:</label>
                  <select
                    className="form-select"
                    style={{ width: "150px" }}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {[
                      "Pending",
                      "Processing",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="list-group list-group-flush">
                {(order.orderItems || []).map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="card-footer">
                Total: ${order.totalAmount.toFixed(2)} | User:{" "}
                {order.user?.email}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <>
          <h4>Manage Users</h4>
          <UserManagement users={users} />
        </>
      )}

      {/* Edit Modal */}
      {editing && (
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product #{editing.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {[
              "name",
              "description",
              "price",
              "stock",
              "imageUrl",
              "categoryId",
            ].map((field, i) => (
              <input
                key={i}
                className="form-control mb-2"
                placeholder={field}
                type={["price", "stock"].includes(field) ? "number" : "text"}
                value={editing[field]}
                onChange={(e) =>
                  setEditing({ ...editing, [field]: e.target.value })
                }
              />
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateProduct}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
