import React from 'react';

/**
 * NoChatContainer Component
 * Displays a welcome/instruction message when no chat is selected.
 * (Project Name: Aram AI)
 */
const NoChatContainer = () => {
    return (
        // The main container fills the entire chat area (flex-1)
        // and uses flex properties to center the content.
        <div className="flex-1 flex items-center justify-center h-full  p-8">
            <div className="text-center max-w-sm">
                
                {/* Icon (Placeholder or custom SVG for Aram AI) */}
                <div className="mx-auto mb-4 p-4 rounded-full bg-accent text-emerald-400 size-20 flex items-center justify-center">
                    {/* Placeholder for an AI/Chat Icon */}
                    <svg 
                        className="size-10" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.805A17.65 17.65 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Welcome to Aram AI
                </h2>

                {/* Subtext / Instructions */}
                <p className="text-base text-foreground/60 mb-6">
                    Select a conversation from the left sidebar to view the chat history, or start a new message.
                </p>

                {/* Optional: Call to Action (CTA) Button */}
                {/* You might want to pass an onClick prop to this component to handle a "New Chat" action */}
                
            </div>
        </div>
    );
}

export default NoChatContainer;