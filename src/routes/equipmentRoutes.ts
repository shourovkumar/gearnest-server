// equipment er route gulo
import express from "express";
import {
  createEquipment,
  deleteEquipment,
  getAllEquipment,
  getEquipmentById,
  getMyEquipment,
  updateEquipment,
} from "../controllers/equipmentController";
import { verifyRole, verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllEquipment);
router.get("/my", verifyToken, getMyEquipment);
router.get("/:id", getEquipmentById);
router.post("/", verifyToken, verifyRole("owner", "admin"), createEquipment);
router.put("/:id", verifyToken, updateEquipment);
router.delete("/:id", verifyToken, deleteEquipment);

export default router;
