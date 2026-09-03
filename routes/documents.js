const express = require('express');
const documentsController = require('../controllers/documentsController');

const router = express.Router();

router.get('/', documentsController.listDocuments);
router.get('/:id', documentsController.getDocument);
router.post('/', documentsController.createDocument);
router.put('/:id', documentsController.replaceDocument);
router.delete('/:id', documentsController.deleteDocument);

module.exports = router;
