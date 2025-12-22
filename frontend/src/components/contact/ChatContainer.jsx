import React, { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputMessage from "./InputMessage";
import { Info, MoreHorizontal, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import NoChatContainer from "./NoChatContainer";
import { socketManager } from "../../utils/SocketManager";

const ChatContainer = () => {
    const {
        currentContact,
        getContactMessages,
        sendMessage,
        authUser,
        deleteMessage,
        updateMessageStatus,
        updateLastMessage,
        updateContactLastMessage,
        emitSocketEvent,
        socketConnected,
        onlineUsers,
        getContacts,
        setContacts
    } = useAuthStore();

    const [messages, setMessages] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messageAreaRef = useRef(null);

    // Check if current contact is online
    const isContactOnline = currentContact?.contactUser?._id &&
        onlineUsers.includes(currentContact.contactUser._id);

    // Fetch messages when contact changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentContact?._id) return;
            const data = await getContactMessages(currentContact._id);
            setMessages(data);
        };
        fetchMessages();
    }, [currentContact?._id]);

    // Listen for real-time messages
    useEffect(() => {
        if (!socketConnected) return;

        const handleReceiveMessage = async (msg) => {
            console.log("📩 ChatContainer received message:", msg);

            // Only add if it's for current contact
            if (msg.contactId === currentContact?._id) {
                setMessages((prev) => [...prev, msg]);

                // Mark as read and delivered if it's from the other person
                if (msg.senderId !== authUser._id) {
                    await updateMessageStatus(msg._id, { delivered: true, read: true });

                    // Emit socket event for status update
                    socketManager?.emit("messageStatusUpdate", {
                        messageId: msg._id,
                        status: { delivered: true, read: true }
                    });
                }
            }

            // Always refresh contacts to update last message
            if (authUser?._id) {
                await getContacts(authUser._id);
            }
        };

        const handleUserTyping = ({ contactId, isTyping }) => {
            if (contactId === authUser._id && currentContact?.contactUser._id) {
                setIsTyping(isTyping);
            }
        };

        const handleMessageStatusUpdate = ({ messageId, status }) => {
            // Update message status in local state
            setMessages(prev => prev.map(msg =>
                msg._id === messageId ? { ...msg, ...status } : msg
            ));
        };

        // Subscribe to socket events
        socketManager?.on("receiveMessage", handleReceiveMessage);
        socketManager?.on("userTyping", handleUserTyping);
        socketManager?.on("messageStatusUpdate", handleMessageStatusUpdate);

        return () => {
            socketManager?.off("receiveMessage", handleReceiveMessage);
            socketManager?.off("userTyping", handleUserTyping);
            socketManager?.off("messageStatusUpdate", handleMessageStatusUpdate);
        };
    }, [socketConnected, currentContact, authUser._id]);

    // Mark messages as read when viewing - FIXED VERSION
    useEffect(() => {
        if (!messages.length || !currentContact?._id) return;

        const markUnreadMessages = async () => {
            console.log(messages)

            // Collect all unread messages from the other person
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].read === true) break;
                if (messages[i].senderId !== authUser._id) {
                    console.log(messages[i]);
                    await updateMessageStatus(messages[i]?._id, {
                        delivered: true,
                        read: true
                    });

                    // Emit socket event
                    socketManager?.emit("messageStatusUpdate", {
                        messageId: msg?._id,
                        status: { delivered: true, read: true }
                    });
                }
            }

            // If there are unread messages, mark them as read

            await getContacts(authUser._id);

        };

        markUnreadMessages();
    }, [messages, currentContact?._id]);

    // Auto scroll to bottom
    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const deleteMsg = async () => {
        if (!selectedMessageId) return;

        await deleteMessage(selectedMessageId);
        setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessageId));
        setSelectedMessageId(null);
    };

    const send = async (messageContent) => {
        if (!messageContent.trim()) return;

        const messageData = {
            contactId: currentContact._id,
            content: messageContent.trim(),
            senderId: authUser._id,
            receiverId: currentContact.contactUser._id,
        };

        try {
            // Send to backend
            const sentMessage = await sendMessage(messageData);

            // Update last message in contact
            await updateLastMessage(currentContact._id, sentMessage._id);
            updateContactLastMessage(currentContact._id, sentMessage);

            // Add to local state

            // Refresh contacts
            if (authUser?._id) {
                await getContacts(authUser._id);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Failed to send message. Please try again.");
        }
    };

    // Handle typing indicator
    const handleTyping = (isCurrentlyTyping) => {
        if (socketConnected && currentContact) {
            emitSocketEvent("typing", {
                contactId: currentContact.contactUser._id,
                isTyping: isCurrentlyTyping
            });
        }
    };

    // Get last seen text
    const getLastSeenText = () => {
        if (isContactOnline) return 'Online';
        if (currentContact?.updatedAt) {
            const lastSeen = new Date(currentContact.updatedAt);
            const now = new Date();
            const diffInMs = now - lastSeen;
            const diffInMins = Math.floor(diffInMs / 60000);

            if (diffInMins < 1) return 'Just now';
            if (diffInMins < 60) return `${diffInMins}m ago`;

            const diffInHours = Math.floor(diffInMins / 60);
            if (diffInHours < 24) return `${diffInHours}h ago`;

            return lastSeen.toLocaleDateString();
        }
        return 'Offline';
    };

    if (!currentContact) return <NoChatContainer />;

    return (
        <div className="flex flex-col w-2/3">
            {/* Header */}
            <div className="py-3 px-4 flex justify-between items-center border-b-1 border-overlay">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <img
                            src={currentContact?.contactUser?.profilePic || "/images/user.jpg"}
                            className="size-12 rounded-xl object-cover"
                            alt="User"
                        />
                        {/* Online indicator */}
                        <div className={`size-2.5 rounded-full absolute right-0 bottom-0 border-2 border-background ${isContactOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                    </div>

                    <div className="flex flex-col">
                        <div className="font-semibold text-sm sm:text-base">
                            {currentContact?.contactUser.firstName}{" "}
                            {currentContact?.contactUser.lastName}
                        </div>

                        <div className="text-[10px] text-foreground/70">
                            {isTyping ? (
                                <span className="text-emerald-500">typing...</span>
                            ) : (
                                <span className={isContactOnline ? 'text-emerald-500 font-medium' : ''}>
                                    {getLastSeenText()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Icons */}
                <div className="flex gap-4 items-center">
                    <Trash2
                        className={`size-5 cursor-pointer ${selectedMessageId ? "visible" : "invisible"
                            }`}
                        onClick={deleteMsg}
                    />
                    <Info className="size-5 cursor-pointer" />
                    <MoreHorizontal className="size-5 cursor-pointer" />
                </div>
            </div>

            {/* Messages */}
            <div
                ref={messageAreaRef}
                className="message-area flex-1 overflow-y-auto flex flex-col p-4 gap-2"
            >
                {messages.length === 0 ? (
                    <p className="text-center text-sm opacity-70 mt-4">
                        No messages yet. Start the conversation!
                    </p>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg._id}
                            message={msg}
                            isOwnMessage={msg.senderId === authUser._id}
                            setSelectedMessageId={setSelectedMessageId}
                            selectedMessageId={selectedMessageId}
                        />
                    ))
                )}
            </div>

            <InputMessage onSubmit={send} onTyping={handleTyping} />
        </div>
    );
};

export default ChatContainer;