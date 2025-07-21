const router = require('express').Router();
const timetableController = require('../controllers/timetableController');

router.post('/', timetableController.create);
router.get('/all/:userId', timetableController.getAll);
router.delete('/:id', timetableController.delete);

module.exports = router;
