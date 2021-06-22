const router = require('express').Router();
const ctrl = require('../controllers');

// /api/fishily/comments
router.get("/", ctrl.comments.index);
router.get("/:id", ctrl.comments.show);
router.post("/:id", ctrl.comments.create);
router.delete('/:id', ctrl.comments.destroy);

module.exports = router;