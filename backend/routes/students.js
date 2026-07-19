const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleGuard');

router.use(authMiddleware);

router.get('/', studentController.getAllStudents);
router.get('/top-borrowers', studentController.getTopBorrowers);
router.get('/search', studentController.searchStudents);
router.get('/:id', studentController.getStudentById);

// Restricted to Admins & Librarians
router.post('/', requireRole('admin', 'librarian'), studentController.createStudent);
router.put('/:id', requireRole('admin', 'librarian'), studentController.updateStudent);
router.delete('/:id', requireRole('admin', 'librarian'), studentController.deleteStudent);

module.exports = router;
