// routes/documentos.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { addDocument, getDocs, setDocument, getDocumentById, setImage } = require('../firebase');

const COLLECTION = 'Reportes'; // Cambia esto por el nombre real

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

// Subir imagen
router.post('/setImage/:id', upload.single('image'), async (req, res) => {
  try {
    const docId = req.params.id;
    const imageBuffer = req.file.buffer;
    const imagePath = await setImage(COLLECTION, docId, imageBuffer);
    res.status(201).json({ id: docId, path: imagePath });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo guardar la imagen' });
  }
});

// Crear documento y subir imagen al mismo tiempo
router.post('/createWithImage', upload.single('image'), async (req, res) => {
  try {
    // 1. Obtener todos los documentos para calcular el siguiente ID
    const docs = await getDocs(COLLECTION);
    let maxId = 0;
    docs.forEach(doc => {
      const docIdNum = parseInt(doc.ID, 10);
      if (!isNaN(docIdNum) && docIdNum > maxId) maxId = docIdNum;
    });
    const nextId = maxId + 1;

    // 2. Crea el documento con los datos recibidos y el nuevo ID
    const docData = { ...req.body, ID: nextId.toString() };
    const docId = await addDocument(COLLECTION, docData);

    // 3. Guarda la imagen usando el docId generado
    const imageBuffer = req.file.buffer;
    const imagePath = await setImage(COLLECTION, docId, imageBuffer);

    // 4. Actualiza el documento para guardar la ruta de la imagen
    await setDocument(COLLECTION, docId, { ...docData, imagePath });

    res.status(201).json({ id: docId, ID: nextId, imagePath });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el documento con imagen' });
  }
});

module.exports = router;
