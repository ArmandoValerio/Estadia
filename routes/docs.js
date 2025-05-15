// routes/documentos.js
const express = require('express');
const router = express.Router();
const { addDocument, getDocs, setDocument, getDocumentById } = require('../firebase');

const COLLECTION = '12345'; // Cambia esto por el nombre real

// Crear documento
router.post('/', async (req, res) => {
  try {
    const docId = await addDocument(COLLECTION, req.body);
    res.status(201).json({ id: docId });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo subir el documento' });
  }
});

// Subir documento con ID personalizado
router.post('/set/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    await setDocument(COLLECTION, docId, req.body);
    res.status(201).json({ id: docId });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo guardar el documento' });
  }
});

// Obtener todos los documentos
router.get('/', async (req, res) => {
  try {
    const docs = await getDocs(COLLECTION);
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron obtener los documentos' });
  }
});

// Obtener documento por ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await getDocumentById(COLLECTION, req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento no encontrado' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el documento' });
  }
});

module.exports = router;
