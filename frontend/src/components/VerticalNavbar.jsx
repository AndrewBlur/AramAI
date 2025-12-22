import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Settings, GraduationCap, Menu, Bot, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "../contexts/theme-provider";
import ChatList from "./chat/ChatList";

const VerticalNavbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { theme, setTheme } = useTheme();
  const { authUser, setShowMyProfile, createChat } = useAuthStore();
  const [activePage, setActivePage] = useState("/chat");
  const [isZoomed, setIsZoomed] = useState(false); 

  

  const contentTransition = { duration: 0.1, delay: 0.01 }; 

  const navItems = [
    { name: "Aram AI", path: "/chat", icon: <Bot size={22} /> },
    { name: "Lawyer", path: "/lawyer", icon: <GraduationCap size={22} /> },
    { name: "Contacts", path: "/contact", icon: <Users size={22} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={22} /> },
  ];

  return (
    <motion.div
      initial={{ width: 68 }}
      animate={{ width: collapsed ? 68 : 260 }}
      transition={{ type: "tween", duration: 0.2 }}
      // Ensure scrollbar-hide is present on the main container
      className={`h-screen overflow-y-auto scrollbar-hide overflow-x-hidden top-0 left-0 z-80 flex flex-col justify-between
                  dark:bg-sidebar/30 bg-sidebar/60 backdrop-blur shadow-lg 
                  rounded-r-2xl fixed md:relative ${collapsed ? "w-16" : "w-70"}
                  ${isZoomed ? "overflow-y-auto" : ""}`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-10 py-6 px-4">
        {/* Logo + Collapse toggle */}
        <div className={`flex items-center justify-between `}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-[#494949]/5 dark:hover:bg-[#494949]/10 transition "
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-3">
          {navItems.map(({ name, path, icon }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => { setActivePage(path); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2 rounded-xl relative group
                 transition-all duration-200 text-foreground overflow-x-hidden
                 ${ isActive ? "bg-[#494949]/10 dark:bg-[#494949]/30 shadow-md" : "hover:bg-[#494949]/5 dark:hover:bg-[#494949]/10" } `
              }
            >
              {icon}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={contentTransition}
                    // FIX: Added whitespace-nowrap here
                    className=" text-foreground **whitespace-nowrap**" 
                  >
                    {name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Middle Section (Chat List) - Ensure inner ChatList scroll container is hidden */}
      <div className="flex-1 overflow-y-auto mt-4 mb-4 min-h-40 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="chatlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.01 }}
              className="w-full flex-1"
            >
              {activePage === "/chat" && (
                <ChatList
                  chats={authUser?.chats || []}
                  onNewChat={createChat}
                  userId={authUser?._id}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Section (User Profile) */}
      <div className="flex flex-col gap-4 py-4">
        <div className="px-3">
          <ModeToggle />
        </div>

        <button
          onClick={() => { setShowMyProfile(); }}
          className={`flex items-center overflow-x-hidden gap-3 py-2  rounded-xl hover:bg-[#494949]/5 dark:hover:bg-[#494949]/10 transition cursor-pointer px-3`}
        >
          <img
            src={authUser?.profilePic || "./images/user.jpg"}
            className="w-10 h-10 rounded-full border-2 overflow-x-hidden border-[#10B981]"
            alt="User"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col overflow-x-hidden items-start **whitespace-nowrap**"
              >
                <p className="font-semibold opacity-80">
                  {authUser?.firstName || "User"}
                </p>
                <p className="text-sm">View Profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};

export default VerticalNavbar;