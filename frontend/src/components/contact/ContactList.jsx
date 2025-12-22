import React, { useEffect, useState } from 'react';
import ContentElement from './ContentElement';
import { Search, ArrowBigLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { socketManager } from '../../utils/SocketManager';

const ContactList = () => {
    
    console.log("contact page rendered.")
    const navigate = useNavigate();
    const { 
        getContacts, 
        authUser, 
        currentContact, 
        setCurrentContact, 
        contacts,
        socketConnected,
        onlineUsers 
    } = useAuthStore();
    const [searchUser, setSearchUser] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onContactClick = (contact) => {
        setCurrentContact(contact);
    };

    // Fetch contacts only on mount
    useEffect(() => {
        const fetchContacts = async () => {
            if (!authUser?._id) return;
            setIsLoading(true);
            try {
                await getContacts(authUser._id);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, [authUser?._id,]);

    // Listen for real-time message updates
    useEffect(() => {
        if (!socketConnected) return;

        const handleReceiveMessage = async (msg) => {
            console.log("📩 ContactList received message:", msg);
            // Refresh contacts to update last message
            if (authUser?._id) {
                await getContacts(authUser._id);
            }
        };

        const handleMessageStatusUpdate = async ({ messageId, status }) => {
            console.log("✓ Message status updated:", messageId, status);
            // Refresh contacts to update read status
            if (authUser?._id && status.read) {
                await getContacts(authUser._id);
            }
        };

        socketManager?.on("receiveMessage", handleReceiveMessage);
        socketManager?.on("messageStatusUpdate", handleMessageStatusUpdate);

        return () => {
            socketManager?.off("receiveMessage", handleReceiveMessage);
            socketManager?.off("messageStatusUpdate", handleMessageStatusUpdate);
        };
    }, [socketConnected, authUser?._id, getContacts]);

    // Filter contacts based on search
    const filteredContacts = searchUser.trim()
        ? contacts.filter((c) => {
            const fullName = `${c.contactUser?.firstName || ''} ${c.contactUser?.lastName || ''}`.toLowerCase();
            return fullName.includes(searchUser.toLowerCase());
        })
        : contacts;

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="w-full h-full flex flex-col border-r-1 border-muted rounded-none md:rounded-lg">
            {/* Header */}
            <div className="py-6 border-b-1 border-muted rounded-t-lg flex flex-row justify-center px-2 gap-2">
                <button 
                    onClick={handleGoBack} 
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors justify-center items-center flex"
                >
                    <ArrowBigLeft className="size-5 opacity-70" />
                </button>

                <div className="w-full dark:bg-foreground/4 bg-foreground/2 text-sm flex gap-2 p-2 rounded-lg items-center">
                    <Search className="size-4" />
                    <input
                        type="text"
                        className="w-full outline-0 bg-transparent"
                        placeholder="Search contacts..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    />
                </div>
            </div>

            {/* Contact List */}
            <div className="flex flex-col overflow-auto flex-1 non-selectable-text">
                {isLoading ? (
                    <p className="text-center text-sm opacity-70 py-4">
                        Loading contacts...
                    </p>
                ) : filteredContacts.length === 0 ? (
                    <p className="text-center text-sm opacity-70 py-4">
                        {searchUser.trim() ? 'No contacts found matching your search' : 'No contacts yet'}
                    </p>
                ) : (
                    filteredContacts.map((contact) => (
                        <ContentElement
                            key={contact._id}
                            contact={contact}
                            onClick={onContactClick}
                            isActive={currentContact?._id === contact._id}
                            isOnline={onlineUsers.includes(contact.contactUser._id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ContactList;