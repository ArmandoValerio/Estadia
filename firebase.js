// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');
const path = require('path');
const fs = require('fs/promises');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function getDocs(collection) {
  const snapshot = await db.collection(collection).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addDocument(collection, data) {
  try {
    const res = await db.collection(collection).add(data);
    return res.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
}

// Nueva función: subir documento con ID personalizado
async function setDocument(collection, docId, data) {
  try {
    await db.collection(collection).doc(docId).set(data);
    return docId;
  } catch (error) {
    console.error('Error setting document:', error);
    throw error;
  }
}

// Nueva función: obtener documento por ID
async function getDocumentById(collection, docId) {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

async function setImage(collection, docId, image) {
  try {
    // Crea la carpeta uploads si no existe
    const uploadsDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // Guarda la imagen (asume que image es un Buffer o base64 string)
    const imagePath = path.join(uploadsDir, `${collection}_${docId}.jpg`);
    if (Buffer.isBuffer(image)) {
      await fs.writeFile(imagePath, image);
    } else {
      // Si es base64, decodifica antes de guardar
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      await fs.writeFile(imagePath, Buffer.from(base64Data, 'base64'));
    }
    return imagePath;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

module.exports = { getDocs, addDocument, setDocument, getDocumentById , setImage};