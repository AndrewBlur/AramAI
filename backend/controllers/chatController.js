import mongoose from "mongoose";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import { generateChatName, safeJSONParse } from "../lib/utils.js";

let AI_API_URL = process.env.AI_API_URL || "http://localhost:8000/chat_stream/";
/**
 * Create a new chat with a default welcome message
 */
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const name = generateChatName();
    // create chat with default AI message
    const chat = await Chat.create({
      user: userId,
      name: name,
      messages: [],
    });

    // push chatId to user (at start of list, sorted)
    await User.findByIdAndUpdate(userId, {
      $push: { chats: { $each: [chat._id], $position: 0 } },
    });

    res.status(201).json({
      _id: chat._id,
      name: chat.name,
      createdAt: chat.createdAt
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

/**
 * Handle user query -> send to AI -> save only if response is complete
 */

export const sendMessage = async (req, res) => {
  try {
    const { chatId, queryreceived, messageId, checkpoint_id } = req.query;
    if (!chatId || !queryreceived) {
      return res.status(400).json({ message: "chatId and queryreceived required" });
    }

    let query;
    try {
      query = JSON.parse(queryreceived);
    } catch (error) {
      return res.status(400).json({ message: "Invalid query format" });
    }
    console.log(query);


    // 2️⃣ Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let streamedContent = "";
    let searchInfo = { stages: [], query: "", urls: [], internalQuery: "", internalUrls: [], ragQuery: "", ragContext: "", error: null };
    let aiMessageSaved = false;
    let letter = "";

    // 3️⃣ Call AI API streaming endpoint
    let aiServiceUrl = `${AI_API_URL}${encodeURIComponent((query.query))}`;
    if (checkpoint_id) {
      aiServiceUrl += `?checkpoint_id=${encodeURIComponent(checkpoint_id)}`;
    }

    const aiResponse = await fetch(aiServiceUrl);

    if (!aiResponse.body) {
      throw new Error("No response body from AI service");
    }
    const reader = aiResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = ""; // Buffer to accumulate incomplete chunks

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // Accumulate chunks in buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE messages (they end with \n\n)
      const messages = buffer.split("\n\n");

      // Keep the last potentially incomplete message in buffer
      buffer = messages.pop() || "";

      for (const message of messages) {
        if (!message.trim()) continue;

        // Handle multi-line SSE messages
        const lines = message.split("\n");
        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            // Strip `data:` prefix
            const cleanLine = line.startsWith("data:") ? line.replace(/^data:\s*/, "") : line;
            if (!cleanLine) continue;

            const data = safeJSONParse(cleanLine);
            if (!data) continue; // Skip if parse failed

            // Stream to frontend
            console.log(data);
            res.write(`data: ${JSON.stringify(data)}\n\n`);

            // Build the persistent searchInfo object on the backend
            switch (data.type) {
              case "checkpoint":
                if (data.checkpoint_id) {
                  await Chat.findByIdAndUpdate(chatId, { checkpoint_id: data.checkpoint_id });
                }
                break;
              case "search_start":
                searchInfo.stages.push("searching");
                searchInfo.query = data.query;
                break;
              case "search_results":
                searchInfo.stages.push("reading");
                searchInfo.urls = Array.isArray(data.urls) ? data.urls : [];
                break;
              case "i_search_start":
                searchInfo.stages.push("internal_searching");
                searchInfo.internalQuery = data.query;
                break;
              case "i_search_results":
                searchInfo.stages.push("internal_reading");
                const i_urls = Array.isArray(data.urls) ? data.urls : (data.url ? [data.url] : []);
                searchInfo.internalUrls = i_urls;
                break;
              case "rag_start":
                searchInfo.stages.push("rag_searching");
                searchInfo.ragQuery = data.query;
                break;
              case "rag_results":
                searchInfo.stages.push("rag_reading");
                searchInfo.ragContext = data.context;
                break;
              case "content":
                streamedContent += data.content;
                break;
              case "search_error":
                searchInfo.stages.push("error");
                searchInfo.error = data.message;
                break;
              case "letter":
                letter += data.letter;
                break;
              case "end":
                // Now save the complete object
                await Chat.findByIdAndUpdate(chatId, {
                  $push: { messages: { role: "user", content: query.query, messageId: messageId } },
                });
                if (streamedContent.trim()) {
                  // Remove duplicates before saving
                  let messages = {
                    role: "ai",
                    content: streamedContent,
                    searchInfo: searchInfo,
                    messageId: Number(messageId) + 1
                  }
                  if (letter.length !== "") {
                    messages.letter = letter;
                  }
                  searchInfo.stages = Array.from(new Set(searchInfo.stages));
                  await Chat.findByIdAndUpdate(chatId, {
                    $push: { messages },
                    checkpoint_id: checkpoint_id
                  });
                  aiMessageSaved = true;
                }
                break;
            }
          } catch (err) {
            console.error("Error parsing AI chunk:", err, line);
            res.write(
              `data: ${JSON.stringify({ type: "search_error", message: "AI chunk parse error" })}\n\n`
            );
          }
        }
      }
    }

    // 4️⃣ If no AI message saved → rollback user message

    res.end();
  } catch (error) {
    console.error("Error in sendMessage:", error);

    res.write(
      `data: ${JSON.stringify({ type: "search_error", message: "Failed to connect to AI" })}\n\n`
    );
    res.end();
  }
};



/**
 * Get all messages in a chat
 */
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Sort messages by messageid (ascending)
    const sortedMessages = [...chat.messages].sort((a, b) => a.messageId - b.messageId);

    res.status(200).json({ messages: sortedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId; // assuming protect middleware sets req.user

    if (!chatId) {
      return res.status(400).json({ error: "chatId is required" });
    }

    // find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // ensure user owns this chat
    if (userId && chat.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this chat" });
    }

    // delete chat
    await Chat.findByIdAndDelete(chatId);

    // remove chat reference from user's chats list
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { chats: chatId },
      });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};