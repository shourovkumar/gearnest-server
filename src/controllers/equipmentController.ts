// equipment er sob logic ekhane
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Equipment from "../models/Equipment";

// notun equipment add kora - sudhu owner / admin
export const createEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category, pricePerDay, image, location } = req.body;

    const equipment = new Equipment({
      name,
      description,
      category,
      pricePerDay,
      image,
      location,
      owner: req.user._id,
    });

    await equipment.save();
    res.status(201).json({ message: "Equipment added", equipment });
  } catch (error) {
    console.log("Create equipment error:", error);
    res.status(500).json({ message: "Equipment add failed" });
  }
};

// sob equipment dekha - public, search + filter + pagination soho
export const getAllEquipment = async (req: any, res: Response) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    let filter: any = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const equipments = await Equipment.find(filter)
      .populate("owner", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Equipment.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      equipments,
    });
  } catch (error) {
    res.status(500).json({ message: "Equipment fetch failed" });
  }
};

// ekta equipment dekha
export const getEquipmentById = async (req: any, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json({ equipment });
  } catch (error) {
    res.status(500).json({ message: "Equipment fetch failed" });
  }
};

// equipment update kora
export const updateEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (
      equipment.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You have no permission" });
    }

    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Equipment updated", equipment: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// equipment delete kora
export const deleteEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    if (
      equipment.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You have no permission" });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// amar equipment gulo
export const getMyEquipment = async (req: AuthRequest, res: Response) => {
  try {
    const equipments = await Equipment.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ equipments });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
