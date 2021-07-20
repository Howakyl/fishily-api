const router = require('express').Router();
const ctrl = require('../controllers');
router.get("/", ctrl.comments.index);
router.get("/:id", ctrl.comments.show);
router.post("/:id", ctrl.comments.create);
router.put("/:id", ctrl.comments.update);
router.delete('/:id', ctrl.comments.destroy);
module.exports = router;
//# sourceMappingURL=comments.js.map