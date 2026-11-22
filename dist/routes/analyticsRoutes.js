"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// analytics er route
const express_1 = __importDefault(require("express"));
const analyticsController_1 = require("../controllers/analyticsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/admin", auth_1.verifyToken, (0, auth_1.verifyRole)("admin"), analyticsController_1.getAdminAnalytics);
router.get("/owner", auth_1.verifyToken, (0, auth_1.verifyRole)("owner", "admin"), analyticsController_1.getOwnerAnalytics);
exports.default = router;
