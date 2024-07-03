const express = require('express');

const { authenticateToken } = require('../utilities');
const notesAppController = require('../controllers/notes-app');

const router = express.Router();

router.post('/add-note', authenticateToken, notesAppController.postAddNote);

router.put('/edit-note/:noteId', authenticateToken, notesAppController.postEditNote);

router.get('/get-all-notes', authenticateToken, notesAppController.getAllNotes);

router.delete('/delete-note/:noteId', authenticateToken, notesAppController.deleteNote);

router.put('/update-note-pinned/:noteId', authenticateToken, notesAppController.updateIsPinned);

router.get('/search-notes/', authenticateToken, notesAppController.searchNotes);

module.exports = router;


