"use client";

import React, { useState, useEffect } from 'react';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Obtener todos los productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4003/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Crear un producto
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsFormVisible(true);
  };

  // Editar un producto
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormVisible(true);
  };

  // Eliminar un producto
  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      console.error("Error: el ID del producto es undefined");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4001/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id.toString() !== productId));
      } else {
        console.error('Error deleting product:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Guardar un producto (crear o actualizar)
  const handleSaveProduct = async (formData) => {
    try {
      const method = selectedProduct ? 'PUT' : 'POST';
      const url = selectedProduct
        ? `http://localhost:4002/api/edit/${selectedProduct.id}` // Microservicio de edición
        : 'http://localhost:4000/api/create'; // Microservicio de creación

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) => {
          if (selectedProduct) {
            return prevProducts.map((product) =>
              product.id === updatedProduct.product.id ? updatedProduct.product : product
            );
          } else {
            return [...prevProducts, updatedProduct.product];
          }
        });
        setIsFormVisible(false);
      } else {
        console.error('Error saving product:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Buscar productos
  const handleSearchProducts = async (query) => {
    try {
      const response = await fetch(`http://localhost:4003/api/search?query=${query}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <div>
      <h1>Products Management</h1>
      <button onClick={handleCreateProduct}>Create New Product</button>

      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => handleSearchProducts(e.target.value)}
      />

      {isFormVisible ? (
        <ProductForm
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsFormVisible(false)}
        />
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />
      )}
    </div>
  );
};

export default ProductsPage;
