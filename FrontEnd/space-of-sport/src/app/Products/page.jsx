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
        const response = await fetch('http://localhost:4003/api/products'); // Microservicio de ProductSearch en el puerto 4003
        const data = await response.json();
        console.log(data.products)
        setProducts(data.products || []); // Asegura que recibas los productos
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Crear un producto
  const handleCreateProduct = () => {
    setSelectedProduct(null); // Sin producto seleccionado
    setIsFormVisible(true);
  };

  // Editar un producto
  const handleEditProduct = (product) => {
    setSelectedProduct(product); // Selecciona el producto para editar
    setIsFormVisible(true);
  };

  // Eliminar un producto
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:4001/api/products/${productId}`, {  // Cambié aquí para que sea `/api/products/${productId}`
        method: 'DELETE',
      });
  
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId)); // Cambié aquí de `id` a `_id`
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
      const formDataWithImage = new FormData();
      formDataWithImage.append('name', formData.name);
      formDataWithImage.append('category', formData.category);
      formDataWithImage.append('price', formData.price);
  
      // Si hay una imagen seleccionada, se adjunta
      if (formData.image) {
        formDataWithImage.append('image', formData.image);
      }
  
      const method = selectedProduct ? 'PUT' : 'POST';
      const url = selectedProduct
        ? `http://localhost:4002/api/edit/${selectedProduct._id}` // Microservicio de Edit en el puerto 4002
        : 'http://localhost:4000/api/create'; // Microservicio de Create en el puerto 4000
  
      const response = await fetch(url, {
        method,
        body: formDataWithImage,
      });
  
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prevProducts) => {
          if (selectedProduct) {
            // Si estamos editando, actualizamos el producto en el estado
            return prevProducts.map((product) =>
              product._id === updatedProduct.product._id ? updatedProduct.product : product
            );
          } else {
            // Si estamos creando, agregamos el nuevo producto
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
      const response = await fetch(`http://localhost:4003/api/search?query=${query}`); // Microservicio de ProductSearch en el puerto 4003
      const data = await response.json();
      setProducts(data.products || []); // Asegura que los productos filtrados sean correctos
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
