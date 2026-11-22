"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyEquipment = exports.deleteEquipment = exports.updateEquipment = exports.getEquipmentById = exports.updateEquipmentStatus = exports.getAdminAllEquipment = exports.getAllEquipment = exports.createEquipment = void 0;
const Equipment_1 = __importDefault(require("../models/Equipment"));
// notun equipment add kora - sudhu owner / admin
const createEquipment = async (req, res) => {
    try {
        const { name, description, category, pricePerDay, rentalPrice, price, image, location, availableQuantity, rentalType, brand, model, condition, terms, } = req.body;
        // FIX: client rentalPrice pathay, server pricePerDay chay - 2 tai accept korbo
        const finalPrice = Number(pricePerDay ?? rentalPrice ?? price ?? 0);
        const finalDesc = description || terms || '';
        if (!finalPrice || isNaN(finalPrice)) {
            return res.status(400).json({ message: 'Price is required' });
        }
        if (!finalDesc) {
            return res.status(400).json({ message: 'Description is required' });
        }
        const equipment = new Equipment_1.default({
            name,
            description: finalDesc,
            category,
            pricePerDay: finalPrice,
            rentalPrice: finalPrice,
            availableQuantity: Number(availableQuantity ?? 1),
            rentalType: rentalType || 'Daily',
            brand: brand || '',
            model: model || '',
            condition: condition || 'Good',
            terms: terms || '',
            image,
            location: location || 'Dhaka',
            owner: req.user._id,
            status: 'Pending',
            availability: true,
        });
        await equipment.save();
        res.status(201).json({ message: 'Equipment added', equipment });
    }
    catch (error) {
        console.log('Create equipment error:', error);
        res.status(500).json({ message: 'Equipment add failed' });
    }
};
exports.createEquipment = createEquipment;
// sob equipment dekha - public, search + filter + pagination soho
// FIX: frontend er sob query ekhon backend bujhbe - search, location, category, rentalType, minPrice, maxPrice, availability, sort
// Public a sudhu Approved + puran status chara gula dekhabe, Pending / Rejected dekhabe na
const getAllEquipment = async (req, res) => {
    try {
        const { search, location, category, rentalType, minPrice, maxPrice, availability, availableOnly, sort, page = 1, limit = 10, } = req.query;
        const andConditions = [
            // Approved + legacy (status nai) - Pending / Rejected hide
            { $or: [{ status: 'Approved' }, { status: { $exists: false } }, { status: null }, { status: '' }] },
        ];
        const searchText = typeof search === 'string' ? search.trim() : '';
        if (searchText) {
            const regex = { $regex: searchText, $options: 'i' };
            andConditions.push({
                $or: [
                    { name: regex },
                    { category: regex },
                    { brand: regex },
                    { location: regex },
                    { description: regex },
                    { model: regex },
                ],
            });
        }
        const locationText = typeof location === 'string' ? location.trim() : '';
        if (locationText) {
            andConditions.push({ location: { $regex: locationText, $options: 'i' } });
        }
        if (category && category !== 'all') {
            andConditions.push({ category });
        }
        if (rentalType && rentalType !== 'all') {
            andConditions.push({ rentalType: { $regex: `^${rentalType}$`, $options: 'i' } });
        }
        const min = minPrice !== undefined && minPrice !== '' ? Number(minPrice) : null;
        const max = maxPrice !== undefined && maxPrice !== '' ? Number(maxPrice) : null;
        if ((min !== null && !isNaN(min)) || (max !== null && !isNaN(max))) {
            const range = {};
            if (min !== null && !isNaN(min))
                range.$gte = min;
            if (max !== null && !isNaN(max))
                range.$lte = max;
            // pricePerDay / rentalPrice - 2 field ei check
            andConditions.push({ $or: [{ pricePerDay: range }, { rentalPrice: range }] });
        }
        const needAvailable = availability === 'true' || availableOnly === 'true';
        if (needAvailable) {
            andConditions.push({ availability: { $ne: false } });
            andConditions.push({
                $or: [{ availableQuantity: { $gt: 0 } }, { availableQuantity: { $exists: false } }, { quantity: { $gt: 0 } }],
            });
        }
        const filter = andConditions.length ? { $and: andConditions } : {};
        let sortObj = { createdAt: -1 };
        if (sort === 'low')
            sortObj = { pricePerDay: 1, rentalPrice: 1 };
        if (sort === 'high')
            sortObj = { pricePerDay: -1, rentalPrice: -1 };
        if (sort === 'new')
            sortObj = { createdAt: -1 };
        const skip = (Number(page) - 1) * Number(limit);
        let equipments = await Equipment_1.default.find(filter)
            .populate('owner', 'name email')
            .skip(skip)
            .limit(Number(limit))
            .sort(sortObj);
        // FIX: DB te rentalPrice 0 thakle pricePerDay diye fill koro - frontend a 0 dekhabe na
        equipments = equipments.map((e) => {
            const obj = e.toObject ? e.toObject() : { ...e };
            const ppd = Number(obj.pricePerDay || 0);
            const rp = Number(obj.rentalPrice || 0);
            if (!rp && ppd)
                obj.rentalPrice = ppd;
            if (!obj.pricePerDay && rp)
                obj.pricePerDay = rp;
            return obj;
        });
        const total = await Equipment_1.default.countDocuments(filter);
        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            equipments,
        });
    }
    catch (error) {
        console.log('Get all equipment error:', error);
        res.status(500).json({ message: 'Equipment fetch failed' });
    }
};
exports.getAllEquipment = getAllEquipment;
// admin er jonno sob equipment - Pending + Approved + Rejected sob
const getAdminAllEquipment = async (req, res) => {
    try {
        const equipments = await Equipment_1.default.find()
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.json({ equipments });
    }
    catch (error) {
        res.status(500).json({ message: 'Equipment fetch failed' });
    }
};
exports.getAdminAllEquipment = getAdminAllEquipment;
// admin approve / reject
const updateEquipmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const equipment = await Equipment_1.default.findByIdAndUpdate(req.params.id, { status, availability: status === 'Approved' ? true : status === 'Rejected' ? false : true }, { new: true });
        if (!equipment)
            return res.status(404).json({ message: 'Equipment not found' });
        res.json({ message: 'Status updated', equipment });
    }
    catch (error) {
        console.log('Status update error:', error);
        res.status(500).json({ message: 'Status update failed' });
    }
};
exports.updateEquipmentStatus = updateEquipmentStatus;
// ekta equipment dekha
const getEquipmentById = async (req, res) => {
    try {
        let equipment = await Equipment_1.default.findById(req.params.id).populate('owner', 'name email');
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        // FIX: rentalPrice 0 hole pricePerDay diye fill
        const eqObj = equipment.toObject ? equipment.toObject() : equipment;
        if (!Number(eqObj.rentalPrice) && Number(eqObj.pricePerDay))
            eqObj.rentalPrice = eqObj.pricePerDay;
        res.json({ equipment: eqObj });
    }
    catch (error) {
        res.status(500).json({ message: 'Equipment fetch failed' });
    }
};
exports.getEquipmentById = getEquipmentById;
// equipment update kora
const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment_1.default.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission' });
        }
        const body = { ...req.body };
        // rentalPrice asle pricePerDay teo bosao
        if (body.rentalPrice) {
            body.pricePerDay = Number(body.rentalPrice);
        }
        const updated = await Equipment_1.default.findByIdAndUpdate(req.params.id, body, {
            new: true,
        });
        res.json({ message: 'Equipment updated', equipment: updated });
    }
    catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};
exports.updateEquipment = updateEquipment;
// equipment delete kora
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment_1.default.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission' });
        }
        await Equipment_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Equipment deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};
exports.deleteEquipment = deleteEquipment;
// amar equipment gulo
const getMyEquipment = async (req, res) => {
    try {
        const equipments = await Equipment_1.default.find({ owner: req.user._id }).sort({
            createdAt: -1,
        });
        res.json({ equipments });
    }
    catch (error) {
        res.status(500).json({ message: 'Fetch failed' });
    }
};
exports.getMyEquipment = getMyEquipment;
