const router = require('express').Router();
const ctrl = require('../controllers');

// /api/fishily/comments
router.get("/", ctrl.comments.index);
router.post("/:id", ctrl.comments.create);

module.exports = router;