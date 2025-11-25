import { create } from "zustand";
import { redirect } from "react-router-dom";
import { socketManager } from "../utils/SocketManager"; // make sure socketManager.js exists

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  // ===========================
  // 🧩 Base State
  // ===========================
  authUser: null,
  socketConnected: false,
  onlineUsers: [],
  currentChatId: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  showMyProfile: false,
  showLetter: false,
  currentContact: null,
  contacts: [],

  // ===========================
  // 🧠 UI Toggles
  // ===========================
  toggleShowLetter: () => set((s) => ({ showLetter: !s.showLetter })),
  setShowMyProfile: () => set((s) => ({ showMyProfile: !s.showMyProfile })),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setCurrentContact: (contact) => set({ currentContact: contact }),
  setContacts: (data) => set({contacts: data}),

  // ===========================
  // 🔌 SOCKET CONNECTION
  // ===========================
 connectSocket: () => {
    const token = localStorage.getItem("authToken");
    const user = get().authUser;
    if (!token || !user) return;

    // Get all contact user IDs for presence tracking
    const contactIds = get().contacts.map(c => c.contactUser._id);

    // Connect socket with handlers
    socketManager.connect({
      token,
      userId: user._id,
      contacts: contactIds,
      onEvents: {
        getOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
        userOnline: (userId) =>
          set((state) => ({
            onlineUsers: [...new Set([...state.onlineUsers, userId])],
          })),
        userOffline: (userId) =>
          set((state) => ({
            onlineUsers: state.onlineUsers.filter((id) => id !== userId),
          })),

        receiveMessage: async (msg) => {
          console.log("📩 New message received:", msg);
          // Refresh contacts to update last message
          if (get().authUser?._id) {
            await get().getContacts(get().authUser._id);
          }
        },
        userTyping: ({ contactId, isTyping }) => {
          console.log(`💬 ${contactId} is ${isTyping ? "typing..." : "idle"}`);
        },
      },
    });

    set({ socketConnected: true });
    
    // Expose socketManager globally for components
    window.socketManager = socketManager;
  },

  disconnectSocket: () => {
    socketManager.disconnect();
    set({ socketConnected: false, onlineUsers: [] });
  },

  emitSocketEvent: (event, data) => {
    socketManager.emit(event, data);
  },

  // ===========================
  // 🧾 AUTHENTICATION
  // ===========================
  login: async (credentials) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await res.json();
      result.ok = res.ok;
      if (!res.ok) throw new Error(result.message || "Login failed");
      
      localStorage.setItem("authToken", result.token);
      set({ isLoggingIn: true, authUser: result.user });
      
      // Fetch contacts before connecting socket
      if (result.user._id) {
        await get().getContacts(result.user._id);
      }
      
      get().connectSocket();
      return result;
    } catch (err) {
      console.error("🚨 Login error:", err);
      throw err;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const options = {
        method: "POST",
        headers: formData instanceof FormData ? undefined : { "Content-Type": "application/json" },
        body: formData instanceof FormData ? formData : JSON.stringify(formData),
      };

      const res = await fetch(`${BACKEND_URL}/api/users/register`, options);
      const data = await res.json();
      if (!data.ok) return data;

      alert("Sign-up successful! Please login.");
      return data;
    } catch (err) {
      throw err;
    } finally {
      set({ isSigningUp: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Auth check failed");

      const profile = await res.json();
      set({ authUser: profile });
      
      // Fetch contacts before connecting socket
      if (profile._id) {
        await get().getContacts(profile._id);
      }
      
      get().connectSocket();
    } catch (err) {
      console.error("🚨 Auth check error:", err);
      localStorage.removeItem("authToken");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: () => {
    get().disconnectSocket();
    localStorage.removeItem("authToken");
    set({ 
      authUser: null, 
      onlineUsers: [], 
      currentChatId: null,
      currentContact: null,
      contacts: []
    });
  },

  // ===========================
  // ⚙️ UNIVERSAL FETCH HELPER
  // ===========================
  fetchWithAuth: async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Not authenticated");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },

  // ===========================
  // 💬 MESSAGES
  // ===========================
  getContactMessages: async (contactId) => {
    const res = await get().fetchWithAuth(`${BACKEND_URL}/api/messages/${contactId}`);
    return res;
  },

  sendMessage: async (messageData) => {
    const message = await get().fetchWithAuth(`${BACKEND_URL}/api/messages/send`, {
      method: "POST",
      body: JSON.stringify(messageData),
    });
    
    // Emit via socket for real-time delivery
    socketManager.sendMessage(message);
    
    return message;
  },

  updateMessageStatus: async (messageId, statusData) => {
    return await get().fetchWithAuth(`${BACKEND_URL}/api/messages/${messageId}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    });
  },

  deleteMessage: async (messageId) => {
    return await get().fetchWithAuth(`${BACKEND_URL}/api/messages/${messageId}`, {
      method: "DELETE",
    });
  },

  // ===========================
  // 💬 CHATS
  // ===========================
  getMessages: async (chatId) => {
    if (!chatId) return redirect("/chat");
    return await get().fetchWithAuth(`${BACKEND_URL}/api/chats/${chatId}/messages`);
  },

  createChat: async (userId) => {
    const chat = await get().fetchWithAuth(`${BACKEND_URL}/api/chats/create`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    set((s) => ({
      authUser: {
        ...s.authUser,
        chats: [chat, ...(s.authUser?.chats || [])],
      },
    }));
    return chat;
  },

  deleteChat: async (chatId) => {
    await get().fetchWithAuth(`${BACKEND_URL}/api/chats/${chatId}`, { method: "DELETE" });
    set((s) => ({
      currentChatId: null,
      authUser: {
        ...s.authUser,
        chats: s.authUser?.chats.filter((c) => c._id !== chatId),
      },
    }));
  },

  // ===========================
  // 🧑‍🤝‍🧑 CONTACTS
  // ===========================
  createContact: async (user1, user2) => {
    const contact = await get().fetchWithAuth(`${BACKEND_URL}/api/contacts`, {
      method: "POST",
      body: JSON.stringify({ user1, user2 }),
    });
    
    // Refresh contacts list
    if (get().authUser?._id) {
      await get().getContacts(get().authUser._id);
    }
    
    return contact;
  },


  getContacts: async (userId) => {
    const res = await get().fetchWithAuth(`${BACKEND_URL}/api/contacts/${userId}`);
    set({ contacts: res });
    return res;
  },

  updateContactLastMessage: (contactId, lastMessage) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c._id === contactId ? { ...c, lastMessage } : c
      ),
    })),

  deleteContact: async (contactId) => {
    return await get().fetchWithAuth(`${BACKEND_URL}/api/contacts/${contactId}`, {
      method: "DELETE",
    });
  },

  updateLastMessage: async (contactId, messageId) => {
    return await get().fetchWithAuth(`${BACKEND_URL}/api/contacts/${contactId}/last-message`, {
      method: "PATCH",
      body: JSON.stringify({ messageId }),
    });
  },
  // ===========================
  // 👨‍⚖️ LAWYER SEARCH
  // ===========================
  findLawyers: async (data) => {
    return await get().fetchWithAuth(`${BACKEND_URL}/api/users/lawyer/search`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ===========================
  // 👤 PROFILE UPDATE
  // ===========================
  updateProfile: async (updates) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // 🟢 Detect File or Blob objects and append them as-is
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    console.log("Updating profile with data:", updates);
    const res = await fetch(`${BACKEND_URL}/api/users/updateProfile`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const updatedUser = await res.json();
    if (!res.ok) throw new Error(updatedUser.message || "Failed to update profile");

    set({ authUser: updatedUser });
    return updatedUser;
  },
}));
