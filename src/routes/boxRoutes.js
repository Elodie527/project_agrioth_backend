const express = require('express');
const router = express.Router();
const { addBox, getBoxes } = require('../controllers/boxController');
const authMiddleware = require('../middleware/authenticate'); // <-- ok, c'est auth.js

router.post('/add', authMiddleware.authenticate, addBox);
router.get('/', authMiddleware.authenticate, getBoxes);

module.exports = router;
