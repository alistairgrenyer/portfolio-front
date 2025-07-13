'use client'; // Mark this as a Client Component

import dynamic from 'next/dynamic';

// Dynamically import the Chat component to prevent hydration issues
const Chat = dynamic(() => import('./Chat'), { ssr: false });

export default function ClientChat() {
  return <Chat />;
}
