const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta del archivo JSON donde están los productos
const filePath = path.resolve(__dirname, '../../../../databases/Products/products.json');

// Función para leer los productos del archivo JSON
const getProducts = () => {
    if (!fs.existsSync(filePath)) {
        return []; // Si el archivo no existe, retornamos un array vacío
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
    try {
        const products = getProducts();
        res.status(200).json({ status: 'success', products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error retrieving products' });
    }
});

// Ruta para buscar productos
router.get('/search', (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
        }

        const products = getProducts();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) // Búsqueda insensible a mayúsculas
        );

        res.status(200).json({ status: 'success', products: filteredProducts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error searching for products' });
    }
});

module.exports = router;
