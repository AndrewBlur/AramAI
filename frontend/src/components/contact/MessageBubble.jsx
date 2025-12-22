import React from "react";

const MessageBubble = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`w-full flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } my-1`}
    >
      <div
        className={`px-4 py-2 rounded-lg text-sm break-words max-w-[85%] md:max-w-[75%] lg:max-w-[65%] ${
          isOwnMessage  
            ? "bg-emerald-700 shadow-lg text-white rounded-br-none"
            : "border-1 border-muted shadow-lg text-foreground rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
