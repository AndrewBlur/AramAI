import { create } from "zustand";
import { io } from "socket.io-client";
import { redirect, replace } from "react-router-dom";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  showMyProfile: false,showLetter: false,
  socket: null,
  onlineUsers: [],
  currentChatId: null,
  toggleShowLetter: () =>
    set((state) => ({
      showLetter: !state.showLetter
    })),
    
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setShowMyProfile: () => set(state => ({ showMyProfile: !state.showMyProfile })),
  login: async (credentials) => {
    // console.log(credentials)
    set({ isLoggingIn: true })
    try {
      const response = await fetch("https://aramai.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) {
        set({ isLoggingIn: false })
        throw new Error(result.message || "Login failed");
      }
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        set({ authUser: result.user });
        // get().connectSocket();
      }
      return response;
    } catch (err) {
      console.error("Login error:", err);
    }
    finally {
      set({ isLoggingIn: false })
    }

  },
  signup: async (formData) => {
  set({ isSigningUp: true })
  try {
    const options = { method: "POST" };
    if (formData instanceof FormData) {
      options.body = formData;
    } else {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(formData);
    }

    const response = await fetch("https://aramai.onrender.com/api/users/register", options);

    const data = await response.json().catch(() => ({})); // 👈 parse JSON always

    if (!response.ok) {
      return { ok: false, ...data };
    }
    alert("SignUp Succefull, Please Login!");
    return { ok: true, ...data }; 
  } catch (err) {
    console.error("Signup error:", err);
    return { ok: false, message: "Network error" };
  } finally {
    set({ isSigningUp: false })
  }
},



  logout: async () => {
    // get().disconnetSocket();
    localStorage.removeItem("authToken");
    set({ authUser: null });


  },
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      const response = await fetch("https://aramai.onrender.com/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // send token in Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      const profile = await response.json();
      // console.log(profile)
      
      // get().connectSocket();
      set({ authUser: profile })

    } catch (error) {
      console.log(error)
    }
    finally {
      set({ isCheckingAuth: false })
    }


  },
  getMessages: async (chatId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      if(!chatId){
        redirect("/chat");
        return;
      }
      const response = await fetch(`https://aramai.onrender.com/api/chats/${chatId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // send token in Authorization header
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch messages");
      }

      const messages = await response.json();
      return messages;

    } catch (error) {
      console.log(error)
    }
  },
  createChat: async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }

      const response = await fetch(`https://aramai.onrender.com/api/chats/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create chat");
      }

      const chat = await response.json();

      // ✅ Update state correctly
      set((state) => ({
        authUser: {
          ...state.authUser,
          chats: [chat, ...(state.authUser?.chats || [])],
        },
      }));

      return chat; // ✅ important so you can navigate right away
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  },
  updateProfile: async (updates) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Prepare FormData for file + JSON fields
    const formData = new FormData();

    // Simple scalar fields
    if (updates.firstName) formData.append("firstName", updates.firstName);
    if (updates.lastName) formData.append("lastName", updates.lastName);
    if (updates.age) formData.append("age", updates.age);
    if (updates.description) formData.append("description", updates.description);

    // File upload
    if (updates.profilePic) formData.append("profilePic", updates.profilePic);

    // Array field → stringify
    if (updates.field && Array.isArray(updates.field)) {
      formData.append("field", JSON.stringify(updates.field));
    }

    // Location (GeoJSON object)
    if (updates.location && updates.location.coordinates) {
      formData.append("location", JSON.stringify(updates.location));
    }

    const response = await fetch("https://aramai.onrender.com/api/users/updateProfile", {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update profile");
    }

    const updatedUser = await response.json();

    // Update authUser in store
    set({ authUser: updatedUser });

    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
},


  findLawyers: async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // Build query string
      const response = await fetch(`https://aramai.onrender.com/api/users/lawyer/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch lawyers");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      throw error;
    }
  },

  // 🗑 Delete chat
  deleteChat: async (chatId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`https://aramai.onrender.com/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete chat");
      }

      // Update state: remove deleted chat from user's list
      
      set({ currentChatId: null }); // Clear currentChatId if needed
      set((state) => ({
        authUser: {
          ...state.authUser,
          chats: state.authUser?.chats.filter((chat) => chat._id !== chatId),
        },
      }));
      return response.json; // Redirect to chats list

    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  },
  // connectSocket: () => {
  //   const token = localStorage.getItem("authToken");
  //   if (!token || get().socket?.connected) return;
  //   const socket = io("http://localhost:5000", {
  //     auth: { token },
  //     userId: get().authUser?._id
  //   });
  //   set({ socket });

  //    socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //    });
   
  // },
  // disconnetSocket: () => {
  //   const socket = get().socket;
  //   if (socket) {
  //     socket.disconnect();
  //     set({ socket: null });
  //   }
  // }
}));