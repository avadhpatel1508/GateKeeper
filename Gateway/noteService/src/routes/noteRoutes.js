const express = require('express');
const { createNote, getNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const { trustGatewayUser } = require('../middleware/gatewayAuthMiddleware');
const { createNoteValidation, updateNoteValidation } = require('../validators/noteValidator');

const router = express.Router();

router.use(trustGatewayUser);

router.post('/', createNoteValidation, createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.patch('/:id', updateNoteValidation, updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
