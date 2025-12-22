import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Capitalized for convention and clarity
const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
