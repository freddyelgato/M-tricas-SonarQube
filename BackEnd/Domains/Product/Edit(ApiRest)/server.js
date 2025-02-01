const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["PUT"],
}));

// Middleware
app.use(bodyParser.json());

// Rutas
const editRoutes = require('./routes/edit');
app.use('/api/edit', editRoutes);

// Configuración del servidor
const PORT = 4002; // Puerto exclusivo para este microservicio
app.listen(PORT, () => {
    console.log(`Edit Products microservice running on http://localhost:${PORT}`);
});
