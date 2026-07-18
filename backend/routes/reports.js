const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/books', reportController.booksReport);
router.get('/students', reportController.studentsReport);
router.get('/fines', reportController.finesReport);
router.get('/transactions', reportController.transactionsReport);
router.get('/category-stats', reportController.getCategoryStats);
router.get('/monthly-issues', reportController.getMonthlyIssues);

module.exports = router;
