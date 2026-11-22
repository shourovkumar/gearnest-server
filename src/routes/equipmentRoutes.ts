// equipment er route gulo
import express from 'express';
import {
  createEquipment,
  deleteEquipment,
  getAdminAllEquipment,
  getAllEquipment,
  getEquipmentById,
  getMyEquipment,
  updateEquipment,
  updateEquipmentStatus,
} from '../controllers/equipmentController';
import { verifyRole, verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllEquipment);
router.get('/my', verifyToken, getMyEquipment);
// IMPORTANT: admin/all age rakhte hobe, naile /:id dhore nibe
router.get('/admin/all', verifyToken, verifyRole('admin'), getAdminAllEquipment);
router.get('/:id', getEquipmentById);
router.post('/', verifyToken, verifyRole('owner', 'admin'), createEquipment);
router.put('/:id/status', verifyToken, verifyRole('admin'), updateEquipmentStatus);
router.put('/:id', verifyToken, updateEquipment);
router.delete('/:id', verifyToken, deleteEquipment);

export default router;
