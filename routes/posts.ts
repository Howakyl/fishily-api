const router = require("express").Router();
import * as ctrl from "../controllers";

// /api/fishily/posts
router.get("/", ctrl.posts.index);
router.get("/:id", ctrl.posts.show);
router.post("/:id", ctrl.posts.create);
router.put("/:id", ctrl.posts.update);
router.delete("/:id", ctrl.posts.destroy);
router.get("/:id/comments", ctrl.posts.comments);

module.exports = router;