'use client';
import React, { useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const Auth = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    // Redirect to the campaign page if the user is logged in
    if (!loading && session) {
      router.push('/campaign');
    }
  }, [session, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen flex flex-col py-16 px-4 sm:px-6 lg:px-8">
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-10 bg-white/80 backdrop-blur-sm shadow-md">
        <Link href="/campaign" className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Mini CRM
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center text-center">
        {!session && (
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full transition-all duration-300 transform scale-100 hover:scale-105">
            <h2 className="text-2xl text-gray-800 font-semibold mb-6">Sign in to Mini CRM</h2>
            <button
              onClick={() => signIn("google", { callbackUrl: "/campaign" })}
              className="flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 9.5c3.2 0 5.6 1.4 7.2 2.9l5.5-5.5C32.9 3.5 28.9 2 24 2c-8.9 0-16.1 7.2-16.1 16.1 0 3.2 1.2 6.1 3.2 8.3L15 22c-1.3-1.6-2.1-3.6-2.1-5.9 0-5.4 4.4-9.8 9.8-9.8z" fill="#EA4335" />
                <path fillRule="evenodd" clipRule="evenodd" d="M41.5 24.1c0-.9-.1-1.8-.3-2.6H24v5h9.4c-1.1 3.5-4.4 6-8.4 6-5 0-9.1-4.1-9.1-9.1 0-5.1 4.1-9.1 9.1-9.1 2.8 0 5.2 1.2 6.9 2.9l4.5-4.5c-2.8-2.6-6.4-4.1-10.4-4.1-8.9 0-16.1 7.2-16.1 16.1s7.2 16.1 16.1 16.1c9.4 0 15.6-7.3 15.6-15.6 0-1.1-.1-2-.3-2.9z" fill="#4285F4" />
                <path fillRule="evenodd" clipRule="evenodd" d="M24 41.5c-5.9 0-11-3.2-13.8-7.9l5.5-4.2c2.1 3.2 5.6 5.4 9.3 5.4 3.6 0 6.6-1.5 8.7-3.9l5.5 4.2c-3.1 3.6-7.5 5.9-13.2 5.9z" fill="#34A853" />
                <path fillRule="evenodd" clipRule="evenodd" d="M9.3 24.1c-.2-.9-.3-1.8-.3-2.6s.1-1.8.3-2.6L4.1 14.7c-1 1.9-1.6 4-1.6 6.3 0 2.2.6 4.3 1.6 6.2l5.2-4.2z" fill="#FBBC05" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Auth;