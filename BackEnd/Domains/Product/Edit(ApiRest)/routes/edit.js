const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ruta del archivo JSON
const filePath = path.resolve(__dirname, '../../../databases/Products/products.json');

// Ruta para editar un producto
router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, category, imageUrl } = req.body;

        // Verificamos si el archivo JSON existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ status: 'error', message: 'Database file not found' });
        }

        // Leemos el archivo JSON
        const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Buscamos el producto por ID
        const productIndex = products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Actualizamos los campos solo si se enviaron en la petición
        if (name) products[productIndex].name = name;
        if (price) products[productIndex].price = parseFloat(price);
        if (category) products[productIndex].category = category;
        if (imageUrl) products[productIndex].imageUrl = imageUrl;

        // Guardamos los cambios en el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

        res.status(200).json({ status: 'success', message: 'Product updated', product: products[productIndex] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error updating the product' });
    }
});

module.exports = router;
