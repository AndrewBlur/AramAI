import Message from "../models/messageModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

const sendMessage = asyncHandler(async (req, res) => {
  const { contactId, senderId, receiverId, content, fileUrl } = req.body;
  console.log("Received message data:", req.body);
    if (!contactId || !senderId || !receiverId || !content) {
        res.status(400);
        throw new Error("Please provide all required fields");
    }
    
    const message = await Message.create({
        contactId: new mongoose.Types.ObjectId(contactId),
        senderId: new mongoose.Types.ObjectId(senderId),
        receiverId: new mongoose.Types.ObjectId(receiverId),
        content,
        fileUrl,
    });
    if (message) {
        res.status(201).json(message);
    } else {
        res.status(400);
        throw new Error("Failed to send message");
    }
});

const getMessages = asyncHandler(async (req, res) => {
  const { contactId } = req.params;

  if (!contactId) {
    res.status(400);
    throw new Error("Contact ID is required");
  }

  const contactObjectId = new mongoose.Types.ObjectId(contactId);

  // Fetch messages sorted oldest → newest
  const messages = await Message.find({ contactId: contactObjectId })
    .select("senderId content read delivered fileUrl createdAt") // ✅ select only what you need
    .sort({ createdAt: 1 });

  res.status(200).json(messages);
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    if (!messageId) {
        res.status(400);
        throw new Error("Message ID is required");
    }
    const message = await Message.findByIdAndDelete(messageId);
    if (message) {
        res.status(200).json({ message: "Message deleted successfully" });
    } else {
        res.status(404);
        throw new Error("Message not found");
    }
});

const updateMessageStatus = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { read, delivered } = req.body;
    if (!messageId) {
        res.status(400);
        throw new Error("Message ID is required");
    }       
    const message = await Message.findById(messageId);
    if (message) {
        message.read = read !== undefined ? read : message.read;
        message.delivered = delivered !== undefined ? delivered : message.delivered;
        const updatedMessage = await message.save();
        res.status(200).json(updatedMessage);
    } else {
        res.status(404);
        throw new Error("Message not found");
    }
});

export { sendMessage, getMessages, deleteMessage, updateMessageStatus };
