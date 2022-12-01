"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const router = require("express").Router();
const ctrl = __importStar(require("../controllers"));
router.get("/", ctrl.users.index);
router.get("/:id", ctrl.users.show);
router.post("/", ctrl.users.create);
router.put("/:id", ctrl.users.update);
router.delete("/:id", ctrl.users.deleteUser);
router.post("/login", ctrl.users.logIn);
router.delete("/login", ctrl.users.logOut);
module.exports = router;
//# sourceMappingURL=users.js.map