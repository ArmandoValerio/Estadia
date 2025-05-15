const express = require('express');
const morgan = require('morgan'); // <-- Agrega esta línea
const docsRoutes = require('./routes/docs');
const app = express();

app.use(morgan('dev')); // <-- Agrega esta línea
app.use(express.json());
app.use('/docs', docsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));