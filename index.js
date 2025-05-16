const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const docsRoutes = require('./routes/docs');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('front'));
app.use('/docs', docsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});