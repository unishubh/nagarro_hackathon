const express = require('express');
const router = express.Router();
var jwt = require('express-jwt');

var ctrlUser = require('../controllers/users');

router.post('/register', ctrlUser.register);
router.post('/login', ctrlUser.login);
router.post('/add_patient_logs', ctrlUser.add_records);
router.post('/get_patient_logs',ctrlUser.get_records);
router.get('/patient',ctrlUser.all_patients);
router.post('/mark_visit',ctrlUser.mark_visit);
router.post('/test',ctrlUser.check_visit);
router.post('/is_visited', ctrlUser.is_visited);
router.get('/disease_count',ctrlUser.disease);
router.post('/city',ctrlUser.city);
router.get('/all_diseases',ctrlUser.see_diseases);

module.exports = router;