"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// equipment er route gulo
const express_1 = __importDefault(require("express"));
const equipmentController_1 = require("../controllers/equipmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', equipmentController_1.getAllEquipment);
router.get('/my', auth_1.verifyToken, equipmentController_1.getMyEquipment);
// IMPORTANT: admin/all age rakhte hobe, naile /:id dhore nibe
router.get('/admin/all', auth_1.verifyToken, (0, auth_1.verifyRole)('admin'), equipmentController_1.getAdminAllEquipment);
router.get('/:id', equipmentController_1.getEquipmentById);
router.post('/', auth_1.verifyToken, (0, auth_1.verifyRole)('owner', 'admin'), equipmentController_1.createEquipment);
router.put('/:id/status', auth_1.verifyToken, (0, auth_1.verifyRole)('admin'), equipmentController_1.updateEquipmentStatus);
router.put('/:id', auth_1.verifyToken, equipmentController_1.updateEquipment);
router.delete('/:id', auth_1.verifyToken, equipmentController_1.deleteEquipment);
exports.default = router;
