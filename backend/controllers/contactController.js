import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Contact from "../models/contactModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// ======================================================
// 🧩 Create Contact
// ======================================================
const createContact = asyncHandler(async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    res.status(400);
    throw new Error("Please provide both user IDs");
  }

  const user1Id = new mongoose.Types.ObjectId(user1);
  const user2Id = new mongoose.Types.ObjectId(user2);

  // Prevent duplicates - check both directions
  const existingContact = await Contact.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id },
    ],
  }).populate([
    { path: "user1", select: "firstName lastName email profilePic" },
    { path: "user2", select: "firstName lastName email profilePic" },
    { path: "lastMessage", select: "content createdAt read" }
  ]);

  if (existingContact) {
    // Format existing contact for frontend
    const currentUserId = req.user?.userId || user1;
    const otherUser = existingContact.user1._id.toString() === currentUserId.toString() 
      ? existingContact.user2 
      : existingContact.user1;

    const formattedContact = {
      _id: existingContact._id,
      contactUser: {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        email: otherUser.email,
        profilePic: otherUser.profilePic,
      },
      lastMessage: existingContact.lastMessage || null,
      updatedAt: existingContact.updatedAt,
    };

    return res.status(200).json(formattedContact);
  }

  // Create new contact
  const newContact = await Contact.create({
    user1: user1Id,
    user2: user2Id,
  });

  if (!newContact) {
    res.status(400);
    throw new Error("Failed to create contact");
  }

  const populatedContact = await newContact.populate([
    { path: "user1", select: "firstName lastName email profilePic" },
    { path: "user2", select: "firstName lastName email profilePic" },
  ]);

  // Format response for frontend
  const currentUserId = req.user?.userId || user1;
  const otherUser = populatedContact.user1._id.toString() === currentUserId.toString() 
    ? populatedContact.user2 
    : populatedContact.user1;

  const formattedContact = {
    _id: populatedContact._id,
    contactUser: {
      _id: otherUser._id,
      firstName: otherUser.firstName,
      lastName: otherUser.lastName,
      email: otherUser.email,
      profilePic: otherUser.profilePic,
    },
    lastMessage: null,
    updatedAt: populatedContact.updatedAt,
  };

  res.status(201).json(formattedContact);
});

// ======================================================
// 🧩 Get All Contacts for a User
// ======================================================
const getContacts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Find all contacts where user is either user1 or user2
  const contacts = await Contact.find({
    $or: [{ user1: userObjectId }, { user2: userObjectId }],
  })
    .populate("lastMessage")
    .lean()
    .populate("user1", "firstName lastName email profilePic")
    .populate("user2", "firstName lastName email profilePic")
    .sort({ updatedAt: -1 });

  // Transform data so frontend always sees "the other person"
  const formattedContacts = contacts.map((contact) => {
    const otherUser =
      contact.user1._id.toString() === userId ? contact.user2 : contact.user1;

    return {
      _id: contact._id,
      contactUser: {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        email: otherUser.email,
        profilePic: otherUser.profilePic,
      },
      lastMessage: contact?.lastMessage || null,
      updatedAt: contact.updatedAt,
    };
  });

  res.status(200).json(formattedContacts);
});

// ======================================================
// 🗑️ Delete Contact
// ======================================================
const deleteContact = asyncHandler(async (req, res) => {
  const { contactId } = req.params;

  if (!contactId) {
    res.status(400);
    throw new Error("Contact ID is required");
  }

  const contact = await Contact.findByIdAndDelete(contactId);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  res.status(200).json({ message: "Contact deleted successfully" });
});

// ======================================================
// ✉️ Update Last Message in a Contact
// ======================================================
const updateLastMessage = asyncHandler(async (req, res) => {
  const { contactId } = req.params;
  const { messageId } = req.body;

  if (!contactId || !messageId) {
    res.status(400);
    throw new Error("Contact ID and Message ID are required");
  }

  const contact = await Contact.findById(contactId);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  contact.lastMessage = new mongoose.Types.ObjectId(messageId);
  const updatedContact = await contact.save();

  // Populate for frontend preview refresh
  const populated = await updatedContact.populate("lastMessage", "content createdAt read");

  res.status(200).json(populated);
});

export { createContact, getContacts, deleteContact, updateLastMessage };