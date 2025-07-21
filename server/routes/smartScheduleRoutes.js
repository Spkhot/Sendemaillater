const router = require('express').Router();
const smartScheduleController = require('../controllers/smartScheduleController');

router.post('/', smartScheduleController.create);
router.get('/all/:userId', smartScheduleController.getAll);
router.delete('/:id', smartScheduleController.delete);

module.exports = router;
