const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno

const router = express.Router();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Definimos el esquema y modelo de producto
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { collection: 'products', timestamps: true }); // Especificar la colección

const Product = mongoose.model('Product', productSchema);

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ status: 'success', products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error retrieving products' });
    }
});

// Ruta para buscar productos
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ status: 'error', message: 'Query parameter is required' });
        }

        const products = await Product.find({
            name: { $regex: query, $options: 'i' } // Búsqueda insensible a mayúsculas
        });

        res.status(200).json({ status: 'success', products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error searching for products' });
    }
});

module.exports = router;
