var express          = require('express'),
router               = express.Router(),
bodyParser           = require('body-parser');

var agentsController = require('../controllers/agentsController');
var safehousesController = require('../controllers/safehousesController');

router.route('/agents')
  .get(agentsController.getAll)
  .post(agentsController.createAgent);

router.route('/agents/:id')
  .get(agentsController.getAgent)
  .patch(agentsController.updateAgent)
  .put(agentsController.updateAgent)
  .delete(agentsController.removeAgent);


router.route('/safehouses')
  .get(safehousesController.getAll)
  .post(safehousesController.createSafehouse);

router.route('/safehouses/:id')
  .get(safehousesController.getSafehouse)
  .patch(safehousesController.updateSafehouse)
  .put(safehousesController.updateSafehouse)
  .delete(safehousesController.removeSafehouse);

module.exports       = router;