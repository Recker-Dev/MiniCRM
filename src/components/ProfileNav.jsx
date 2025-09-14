"use client";
import { useState, useRef, useEffect } from 'react';
import useCampaignStore from '@/stores/campaignStore';
import Link from 'next/link'; 
import { signOut } from "next-auth/react";

const ProfileNav = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);


  return (
    <div className="relative" ref={navRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-lg shadow-md hover:bg-blue-600 hover:scale-110 active:scale-95 transition "
        aria-label="Profile menu"
      >
        {session?.user?.avatar ? (
          <img
            src={session.user.avatar}
            alt={session.user.name || "User Avatar"}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          session?.user?.name
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20">
          <div className="block px-4 py-2 text-xs text-gray-400">
            My Account
          </div>
          <Link
            href="/history"
            onClick={() => { setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Show Campaigns
          </Link>
          <Link
            href="/campaign"
            onClick={() => { setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            New Campaigns
          </Link>
          <Link
            href="/"
            onClick={() => { useCampaignStore.getState().resetStore(); signOut(); setIsOpen(false); }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileNav;
