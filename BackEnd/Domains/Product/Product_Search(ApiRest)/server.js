const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
}));

// Middleware
app.use(bodyParser.json());

// Rutas
const searchRoutes = require('./routes/search');
app.use('/api/products', searchRoutes);

// Configuración del servidor
const PORT = 4003; // Puerto exclusivo para este microservicio
app.listen(PORT, () => {
    console.log(`Search Products microservice running on http://localhost:${PORT}`);
});
