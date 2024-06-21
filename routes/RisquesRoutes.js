const express = require('express');
const router = express.Router();
const Risque = require('../models/Risque');
const RisqueController = require('../controllers/RisqueController');
const passport = require('passport');

router.post('/risque', RisqueController.AddRisque);
router.get('/risque', passport.authenticate("jwt", { session: false }), RisqueController.FindAll);
router.get('/risque/:id', passport.authenticate("jwt", { session: false }), RisqueController.FindOne);
router.patch('/risque/:id', passport.authenticate("jwt", { session: false }), RisqueController.UpdateOne);
router.delete('/risque/:id', passport.authenticate("jwt", { session: false }), RisqueController.DeleteOne);
router.get('/project/:id', RisqueController.getRisqueByProjectId);


module.exports = router;
