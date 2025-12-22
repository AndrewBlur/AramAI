import { useAuthStore } from "@/store/useAuthStore";
import { FilePenLine, EllipsisVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatList = ({ chats, onNewChat, userId }) => {
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState(null); // right-click menu
  const { currentChatId, setCurrentChatId, deleteChat, authUser } = useAuthStore();

  const handleNewChat = async () => {
    const chat = await onNewChat(userId);
    if (chat?._id) {
      navigate(`/chat/${chat._id}`);
      setCurrentChatId(chat._id);
    }
  };

  const handleDelete = async (chatId) => {
    await deleteChat(chatId);

    // If deleted chat was active → redirect to latest
    if (chatId === currentChatId) {
      if (authUser.chats.length > 0) {// chats are sorted newest → oldest
        navigate(`/chat`);
      } else {
        navigate("/onboarding");
      }
    }
    setContextMenu(null);
  };

  const toggleMenu = (chatId, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Default: open downward
    let y = rect.bottom + 4;

    // If not enough space below → open upward
    if (viewportHeight - rect.bottom < 100) {
      y = rect.top - 60; // menu height approx
    }

    setContextMenu({
      x: rect.right - 120, // align right
      y,
      chatId,
    });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div className="w-full h-fit px-3 flex flex-col relative ">
      {/* New Chat Button */}
      <div className="font-medium tracking-wider text-xs opacity-60 mb-4">
        ARAM AI
      </div>
        <button onClick={handleNewChat} className="flex gap-2 items-center w-full p-2 mb-6 hover:bg-muted transition-all duration-100 rounded-lg">
          <FilePenLine size={16} />
          <p className="text-sm">New Chat</p>
        </button>

      {/* Chat List */}
      <div className="w-full flex-1 space-y-2 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-sm text-gray-500">No chats yet. Start a new one!</p>
        ) : (
          chats.map((chat) => (
            <div key={chat._id} className="flex justify-between items-center">
              <button
                onClick={() => {
                  navigate(`/chat/${chat._id}`);
                  setCurrentChatId(chat._id);
                }}
                className={`w-full text-sm px-2 text-left py-2 dark:hover:bg-muted/40 hover:bg-muted transition-all duration-100 rounded-lg ${
                  currentChatId === chat._id ? "bg-foreground/10" : ""
                }`}
              >
                <span>{chat.name || "Untitled Chat"}</span>
              </button>

              {/* Ellipsis Menu Button */}
              <button onClick={(e) => toggleMenu(chat._id, e)}>
                <EllipsisVertical className="size-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            position: "fixed", // 🔑 important: fixed to viewport
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          className="bg-white dark:bg-sidebar shadow-lg rounded-md z-50 space-y-1 w-32"
        >
          <button
            className="text-red-500 text-sm w-full text-left px-4 py-1 hover:bg-red-700/20 rounded"
            onClick={() => handleDelete(contextMenu.chatId)}
          >
            Delete Chat
          </button>
          <button
            className="text-sm w-full text-left px-4 py-1 hover:bg-foreground/10 rounded"
            onClick={() => setContextMenu(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatList;
