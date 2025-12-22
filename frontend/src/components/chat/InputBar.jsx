import { useAuthStore } from "@/store/useAuthStore";
import { ArrowUp, StickyNote } from "lucide-react";
import { useRef, useEffect } from "react";

const InputBar = ({ currentMessage, setCurrentMessage, onSubmit, disabled }) => {
  const textareaRef = useRef(null);
  const { showLetter, toggleShowLetter } = useAuthStore();

  const handleChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentMessage.trim() !== "") {
        onSubmit(e);
        setCurrentMessage("");
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        128
      )}px`; // max 4 rows ~128px
    }
  }, [currentMessage]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (currentMessage.trim() !== "") {
      onSubmit();
      setCurrentMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 z-90 w-[95%] md:w-xl lg:w-4xl xl:w-5xl 2xl:w-6xl"
    >
      <div className="flex items-center bg-sidebar/60 rounded-xl p-2 shadow-md w-full">
        <button
          className={`p-2 rounded-lg ${
            showLetter
              ? "bg-gradient-to-l opacity-80 from-emerald-500 to-green-600 text-white"
              : ""
          }`}
          type="button"
          onClick={toggleShowLetter}
        >
          <StickyNote className="size-5" />
        </button>
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={currentMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-grow px-4 py-2 bg-transparent focus:outline-none resize-none text-foreground placeholder:text-muted-foreground overflow-y-auto"
          style={{ lineHeight: "1.5rem" }}
        />

        <button
          type="submit"
          disabled={disabled}
          className="bg-[linear-gradient(var(--gradient-accent))] hover:opacity-90 rounded-xl p-2 ml-2 shadow-md transition-all duration-200 group"
        >
          <ArrowUp className="group-hover:scale-105 text-white transition-all duration-150" />
        </button>
      </div>
    </form>
  );
};

export default InputBar;