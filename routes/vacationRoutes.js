const express = require('express');
const router = express.Router();
const VacationController = require('../controllers/VacationController');

router.post('/vacation', VacationController.createVacationRequest);
router.get('/vacation/:userId', VacationController.getVacationRequestsByUser);
// Route pour récupérer toutes les demandes de vacances (administratif)
router.get('/vacationRequests', VacationController.getAllVacationRequests);

// Route pour rejeter une demande de vacances
router.patch('/vacationRequests/:requestId/reject', VacationController.rejectVacationRequest);
// Route pour approuver une demande de vacances
router.patch('/vacationRequests/:requestId/approve', VacationController.approveVacationRequest);

router.get('/users/:userId/remainingDays', VacationController.getRemainingVacationDays); // Nouvelle route


module.exports = router;