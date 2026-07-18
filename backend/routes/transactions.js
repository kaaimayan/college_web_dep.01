const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Book Issues / Returns
router.post('/issue', transactionController.issueBook);
router.post('/return', transactionController.returnBook);
router.get('/', transactionController.getAllTransactions);
router.get('/overdue', transactionController.getOverdueBooks);

// Reservations
router.get('/reservations', transactionController.getReservations);
router.post('/reservations', transactionController.createReservation);
router.put('/reservations/:id', transactionController.updateReservationStatus);

// Fines
router.get('/fines', transactionController.getFines);
router.put('/fines/:id/pay', transactionController.payFine);

// Dashboard metrics
router.get('/dashboard-stats', transactionController.getDashboardStats);

module.exports = router;
