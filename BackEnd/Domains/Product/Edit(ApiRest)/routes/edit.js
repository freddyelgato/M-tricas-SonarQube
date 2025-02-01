const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config(); // Cargar variables de entorno

const router = express.Router();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Asegura que el servidor no inicie si no se puede conectar a MongoDB
});

// Definimos el esquema y modelo de producto
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Configuración de multer para manejo de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Carpeta 'uploads' dentro de Product
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.put('/:_id', upload.single('image'), async (req, res) => {
    console.log("Request received");
    try {
        const productId = req.params._id;  // Aquí recogemos el _id de la URL
        console.log("Editing product with _id:", productId);
        const { name, price, category } = req.body;

        // Buscar el producto en la base de datos para obtener la imagen actual
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        // Crear objeto para actualizar solo los campos provistos
        const updateData = {};
        if (name) updateData.name = name;
        if (price) updateData.price = parseFloat(price);
        if (category) updateData.category = category;

        // Manejo de nueva imagen: solo actualizamos la imagen si se sube una nueva
        if (req.file) {
            // Eliminar la imagen anterior si existe
            if (product.imageUrl) {
                const oldImagePath = path.join(__dirname, '../../uploads', product.imageUrl.split('/').pop());
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    } else {
                        console.log('Old image deleted successfully');
                    }
                });
            }

            // Actualizar la URL de la nueva imagen
            updateData.imageUrl = 'http://localhost:4000/uploads/' + req.file.filename;
        } else {
            // Si no se sube una nueva imagen, mantenemos la imagen existente
            updateData.imageUrl = product.imageUrl;
        }

        // Actualizar producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        res.status(200).json({ status: 'success', message: 'Product updated', product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error updating the product' });
    }
});

module.exports = router;
