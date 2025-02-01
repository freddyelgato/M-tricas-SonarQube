// src/app/cart/page.jsx
import React from "react";
import CartContent from "@/components/CartContent";

// Función para obtener los productos del carrito desde una API (dummyjson)
const loadCart = async (id) => {
  const res = await fetch(`https://dummyjson.com/carts/${id}`);
  const data = await res.json();
  return data;
};

async function CartPage() {
  const { products } = await loadCart(2);
  return <CartContent products={products} />;
}

export default CartPage;
