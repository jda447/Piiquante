const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

router.post('/', sauceCtrl.addSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.findOneSauce);

module.exports = router;