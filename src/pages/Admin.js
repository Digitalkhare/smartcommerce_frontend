import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import dayjs from "dayjs";
import { Modal, Button } from "react-bootstrap";

const Admin = () => {
  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openEditModal = (product) => {
    setEditing({ ...product, categoryId: product.category?.id });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await axios.delete(`/products/admin/${id}`);
    fetchProducts();
  };
  // const updateProduct = async (e) => {
  //   e.preventDefault();
  //   await axios.put(`/products/admin/${editing.id}`, editing);
  //   setEditing(null);
  //   fetchProducts();
  // };
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/products/admin/${editing.id}`, editing);
      closeModal();
      fetchProducts();
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("/products");
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get("/orders/admin"); // Requires admin role
    setOrders(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await axios.post("/products/admin", newProduct); // Admin-only endpoint
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

  return (
    <div className="container mt-4">
      <h2>🧑‍💼 Admin Panel</h2>

      <div className="btn-group my-3">
        <button
          className={`btn ${
            tab === "products" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          className={`btn ${
            tab === "orders" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
      </div>

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
            </tbody>
          </table>
        </>
      )}

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

      {tab === "orders" && (
        <>
          <h4>Customer Orders</h4>
          {orders.map((order) => (
            <div className="card mb-3" key={order.id}>
              <div className="card-header d-flex justify-content-between">
                <div>
                  <strong>Order #{order.id}</strong> -{" "}
                  {dayjs(order.orderDateTime).format("MMM D, YYYY h:mm A")}
                </div>
                <span className="badge bg-secondary">{order.status}</span>
              </div>
              <ul className="list-group list-group-flush">
                {(order.OrderItems || []).map((item) => (
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

      {/* {editing && (
        <form onSubmit={updateProduct} className="row g-2 mb-4">
          <h5>Editing Product #{editing.id}</h5>
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
                value={editing[field]}
                onChange={(e) =>
                  setEditing({ ...editing, [field]: e.target.value })
                }
                required
              />
            </div>
          ))} */}
      {/* <div className="col-12">
            <button className="btn btn-success me-2" type="submit">
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )} */}
    </div>
  );
};

export default Admin;
