const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "DELETE"],
}));

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Welcome to the Delete Products API');
});

// Middleware
app.use(bodyParser.json());

// Base de datos (archivo JSON)
const databasePath = path.join(__dirname, '../../../databases/Products/products.json');
if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify([]));
}

// Rutas
const deleteRoutes = require('./routes/delete');
app.use('/api/products', deleteRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Configuración del servidor
const PORT = 4001; // Puerto exclusivo para este microservicio
app.listen(PORT, () => {
    console.log(`Delete Products microservice running on http://localhost:${PORT}`);
});
