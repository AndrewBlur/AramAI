import User from '../models/userModel.js';
import bcrypt, { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cloudinary from '../lib/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, age, role, latitude, longitude } = req.body;
    const file = req.file;
    console.log("Received file:", file);
    const profilePic = file ? file.path : null;
    let profilePicUrl = null;
    if (profilePic) {
      const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
        folder: "users/profilePics",
      });
      profilePicUrl = cloudinaryResponse.secure_url;
      console.log(fs.existsSync(file.path));
      fs.unlink(file.path, (err) => {
        if (err) console.log("Error deleting temp file:", err);
      });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ email: 'Email already exists' });
    }
    existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ mobile: 'Mobile no already used' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    if (role === "user") {
      const newUser = new User({
        firstName,
        lastName,
        mobile,
        age,
        profilePic: profilePicUrl,
        email,
        password: hashedPassword,
        role,
        chats: [],
        location: {
          type: "Point",
          coordinates: longitude && latitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0]
        }
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
      console.log("New user created:", newUser);
    } else {
      const newUser = new User({
        firstName,
        lastName,
        mobile,
        age,
        profilePic: profilePicUrl,
        email,
        password: hashedPassword,
        role,
        chats: [],
        field: [],
        description: "",
        experience: 0,
        rating: {
          count: 0,
          reviews: [],   // match schema field
        },
        location: {
          type: "Point",
          coordinates: longitude && latitude ? [parseFloat(longitude), parseFloat(latitude)] : [0, 0]
        }
      });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Server error`, error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password Incorrect' });
    }
    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    let safeUser = await User.findById(user._id).select('-password')
      .populate({
        path: "chats",
        options: { sort: { createdAt: -1 } }, // sorted
      });
    const obj = safeUser.toObject();
    const chats = obj.chats.map(chat => ({
      _id: chat._id,
      name: chat.name,
      checkpoint_id: chat.checkpoint_id,
      createdAt: chat.createdAt,
    }));


    res.status(200).json({ token, user: { ...obj, chats: chats } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate({
        path: "chats",
        options: { sort: { createdAt: -1 } } // sort newest → oldest
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const obj = user.toObject();
    const chats = (obj.chats || []).map((chat) => ({
      _id: chat._id,
      name: chat.name,
      checkpoint_id: chat.checkpoint_id,
      createdAt: chat.createdAt,
    }));
    res.status(200).json({ ...obj, chats: chats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    let updates = { ...req.body };
    const file = req.file;
    console.log("Received profile update with data:", updates, "and file:", file);

    // Parse JSON fields if they exist
    if (updates.field) {
      try {
        updates.field = JSON.parse(updates.field);
      } catch {
        updates.field = [];
      }
    }

    if (updates.location) {
      try {
        updates.location = JSON.parse(updates.location);
      } catch {
        updates.location = undefined;
      }
    }

    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle profilePic
    let profilePicUrl = user.profilePic;
    if (file) {
      if (user.profilePic) {
        const parts = user.profilePic.split("/");
        const publicIdWithExt = parts[parts.length - 1]; // e.g. rnscw8ds9dasw0efte7r.jpg
        const publicId = publicIdWithExt.split(".")[0]; // remove .jpg

        await cloudinary.uploader.destroy(publicId);
      }

      // ✅ Upload new file to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
        folder: "users/profilePics",
      });
      console.log("Cloudinary upload response:", cloudinaryResponse);
      fs.unlink(file.path, (err) => {
        if (err) console.log("Error deleting temp file:", err);
        else console.log("Temp file deleted ✅");
      });

      profilePicUrl = cloudinaryResponse.secure_url;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { ...updates, profilePic: profilePicUrl },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error Updating Profile", error: error.message });
  }
};


export const findLawyers = async (req, res) => {
  try {
    const { id, field, q, longitude, latitude, maxDistance } = req.body;

    let filters = [{ role: "lawyer"},{ _id: { $ne: id } }];

    if (q) {
      filters.push({
        $or: [
          { firstName: { $regex: q, $options: "i" } },
          { lastName: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { field: { $regex: q, $options: "i" } },
        ],
      });
    }

    if (field && field.length > 0) {
      const fields = Array.isArray(field) ? field : field.split(",");
      filters.push({ field: { $in: fields } });
    }

    const query = filters.length > 1 ? { $and: filters } : filters[0];

    let lawyers;
    console.log(parseInt(maxDistance));
    if (longitude && latitude) {
      lawyers = await User.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            $maxDistance: parseInt(maxDistance) || 5000,
          },
        },
      }).select("-password -chats");
    } else {
      lawyers = await User.find(query).select("-password -chats");
    }

    res.json(lawyers);
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({ message: "Server error" });
  }
};


