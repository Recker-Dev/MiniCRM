"use client";
import React from 'react';
import ProfileNav from '@/components/ProfileNav';
import { useSession } from "next-auth/react";

const Header = () => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return null;
    }
    return (
        <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm shadow-md">
            <a href="/campaign" className="text-3xl font-extrabold text-blue-700 tracking-tight">
                Mini CRM
            </a>
            <div className="flex items-center space-x-4">
                {/* Display name or email if a session */}
                {session && (
                    <>
                        <span className="text-gray-600 truncate hidden md:inline">
                            Hello {session?.user?.name || session?.user?.email} !
                        </span>
                        <ProfileNav session={session} />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
