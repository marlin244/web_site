const router = require('express').Router();
const ctrl = require('../controllers/bookingsController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.list);
router.post('/', ctrl.create);
router.patch('/:id/status', auth, ctrl.updateStatus);

module.exports = router;
