// Importamos los módulos necesarios
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Para leer y escribir archivos
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos
require('dotenv').config(); // Para cargar las variables de entorno

const router = express.Router();

// Configuración de multer para manejar las imágenes subidas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Carpeta 'uploads' dentro de Product
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombrar archivo para evitar conflictos
  }
});
const upload = multer({ storage: storage });

// Ruta para agregar un nuevo producto
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Validamos que la imagen esté presente
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No image uploaded' });
    }

    // Validamos que el cuerpo del producto tenga datos básicos
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ status: 'error', message: 'Product name, price, and category are required' });
    }

        // Ruta correcta desde 'Domains/Product/'
    const filePath = path.resolve(__dirname, '../../../../../databases/Products/products.json');
    console.log('Archivo JSON en:', filePath);  // Verifica la ruta generada

    // Leemos el archivo JSON donde se guardan los productos
    const products = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Leemos el archivo .json


    // Creamos un nuevo producto
    const newProduct = {
      id: uuidv4(), // Generamos un ID único
      name,
      price: parseFloat(price),
      category,
      imageUrl: 'http://localhost:4000/uploads/' + req.file.filename,
    };

    // Añadimos el nuevo producto a la lista de productos
    products.push(newProduct);

    // Guardamos el archivo JSON con el nuevo producto
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2)); // Escribimos en el archivo .json

    // Respondemos con el producto creado
    res.status(201).json({ status: 'success', message: 'Product created', product: newProduct });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error processing the product' });
  }
});

module.exports = router;
