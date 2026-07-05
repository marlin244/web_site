const router = require('express').Router();
const ctrl = require('../controllers/worksController');
const auth = require('../middleware/auth');

router.get('/', ctrl.list);
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
