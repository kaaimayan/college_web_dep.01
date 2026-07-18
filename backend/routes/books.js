const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.use(authMiddleware);

router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/categories', bookController.getCategories);
router.get('/authors', bookController.getAuthors);
router.get('/publishers', bookController.getPublishers);
router.get('/:id', bookController.getBookById);

router.post('/', upload.single('cover_image'), bookController.createBook);
router.put('/:id', upload.single('cover_image'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
