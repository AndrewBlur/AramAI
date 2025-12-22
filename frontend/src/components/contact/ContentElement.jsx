import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const ContentElement = ({ contact, onClick, isActive, isOnline }) => {

    useEffect(() => {
        // Preload contact user image
        const img = new Image();
        img.src = contact.contactUser?.profilePic || '/images/user.jpg';
    }, [contact.contactUser]);

    const { authUser } = useAuthStore();
    const contactUser = contact.contactUser || {};
    const lastMessage = contact.lastMessage?.content || '';
    
    // Check if message is unread - only if current user is the receiver
    const isUnread = contact.lastMessage && 
                     contact.lastMessage.receiverId === authUser._id && 
                     !contact.lastMessage.read;

    // Format last seen time
    const getLastSeenText = () => { 
        if (contact.updatedAt) {
            const lastSeen = new Date(contact.updatedAt);
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

    return (
        <div
            className={`p-4 w-full flex gap-2 items-center relative  
                  border-y border-muted cursor-pointer transition-colors
                  ${isActive ? 'bg-emerald-500/20' : 'hover:bg-emerald-500/10'}`}
            onClick={() => onClick(contact)}
        >
            <div className="border size-12 rounded-xl flex-shrink-0 relative non-selectable-text">
                <img
                    src={contactUser.profilePic || '/images/user.jpg'}
                    className="size-12 rounded-xl object-cover"
                    draggable={false}
                    alt={contactUser.firstName || 'User'}
                />
                {/* Online indicator */}
                <div className={`size-2 rounded-full absolute right-0 -bottom-0.5 ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-evenly overflow-hidden non-selectable-text flex-1">
                <h4 className="font-medium text-[16px] truncate">
                    {`${contactUser.firstName || ''} ${contactUser.lastName || ''}`.trim() || 'Unknown User'}
                </h4>
                <p className={`text-sm text-[12px] w-[90%] truncate ${
                    isUnread ? 'font-semibold opacity-90' : 'opacity-70'
                }`}>
                    {lastMessage || 'No messages yet'}
                </p>
            </div>

            {/* Time & Status */}
            <div className="absolute text-[11px] right-4 opacity-70 top-4 flex flex-col items-end gap-1">
                <div>
                    {contact.lastMessage?.createdAt && new Date(contact.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <div className="text-[10px]">
                    {getLastSeenText()}
                </div>
                {isUnread && (
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        New
                    </span>
                )}
            </div>
        </div>
    );
};

export default ContentElement;