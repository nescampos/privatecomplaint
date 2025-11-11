"use client"; // Next.js directive for client-side rendering
import "@midnight-ntwrk/dapp-connector-api"; // Import Midnight wallet connector
import { useState } from "react";


const [connected, setConnected] = useState(false);


export default function ConnectWalletButton() {
    const [connected, setConnected] = useState(false); // Track wallet connection status
    const handleClick = async () => {
        try {
            const api = await window.midnight.mnLace.enable(); // Prompt Lace wallet to connect
            if (api) setConnected(true); // Update state if connection succeeds
        } catch (error) {
            console.log("an error occurred", error); // Log errors
        }
    };

    return (
        <nav className="flex items-center w-full">
            <div className="mx-2 flex gap-4" /> {/* Spacer */}
            <button
                type="button"
                onClick={handleClick} // Call connect handler
                className="ml-auto m-2 px-2 py-1 rounded-2xl bg-black text-white"
            >
                {connected ? "Connected" : "Connect Wallet"} {/* Change text based on state */}
            </button>
        </nav>
    );
}