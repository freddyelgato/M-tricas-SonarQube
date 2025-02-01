// Contnido de la pagina de carrrito
"use client";
import React, { useState } from "react";
import Link from "next/link";

function CartPage({ products }) {
  const [cartItems, setCartItems] = useState([...products]);
  const [subtotal, setSubtotal] = useState(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const [shippingCost] = useState(40); // Precio de envío
  const [total, setTotal] = useState(subtotal + shippingCost);

  const updateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(quantity) } : item
    );
    setCartItems(updatedCart);
    recalculateTotal(updatedCart);
  };

  const recalculateTotal = (updatedCart) => {
    const newSubtotal = updatedCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shippingCost);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    recalculateTotal(updatedCart);
  };

  return (
    <div className="cart-container">
      <h1 className="text-center">Tu Carrito de Compras</h1>

      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <p className="text-center">Tu carrito está vacío.</p>
        ) : (
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/product/${item.id}`}>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={{ width: "80px" }}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="cart-summary">
        <h3 className="text-center">Resumen de la Compra</h3>
        <div className="summary-details">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Envío:</strong> ${shippingCost}</p>
          <hr />
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        </div>

        <div className="cart-actions">
          <button className="btn btn-warning" onClick={() => setCartItems([])}>
            Vaciar Carrito
          </button>
          <Link href="/checkout">
            <button className="btn btn-success">Finalizar Compra</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
